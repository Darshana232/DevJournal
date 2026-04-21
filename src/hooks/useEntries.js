import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useJournal } from '../context/JournalContext';
import { supabase } from '../services/supabaseClient';
import { updateStatsOnEntry, updateStatsOnDelete } from '../services/analyticsService';
import { countWords } from '../utils/markdownParser';
import { generateEntryTitle, toISO } from '../utils/dateHelpers';
import { logger } from '../utils/logger';

// ── Column name mappers (JS camelCase ↔ DB snake_case) ──────────────────────

/** Transform a DB row (snake_case) → app entry (camelCase) */
function fromRow(row) {
  return {
    id:          row.id,
    title:       row.title,
    content:     row.content,
    mood:        row.mood,
    tags:        row.tags ?? [],
    date:        row.date,
    wordCount:   row.word_count,
    isPrivate:   row.is_private,
    aiInsight:   row.ai_insight,
    codeSnippet: row.code_snippet,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

/** Transform an app entry (camelCase) → DB insert/update payload (snake_case) */
function toRow(data, userId) {
  const row = {};
  if (userId            !== undefined) row.user_id      = userId;
  if (data.title        !== undefined) row.title        = data.title;
  if (data.content      !== undefined) row.content      = data.content;
  if (data.mood         !== undefined) row.mood         = data.mood;
  if (data.tags         !== undefined) row.tags         = data.tags;
  if (data.date         !== undefined) row.date         = data.date;
  if (data.wordCount    !== undefined) row.word_count   = data.wordCount;
  if (data.isPrivate    !== undefined) row.is_private   = data.isPrivate;
  if (data.aiInsight    !== undefined) row.ai_insight   = data.aiInsight;
  if (data.codeSnippet  !== undefined) row.code_snippet = data.codeSnippet;
  if (data.updatedAt    !== undefined) row.updated_at   = data.updatedAt;
  return row;
}

/**
 * Abstracts all entry CRUD operations against Supabase Postgres.
 * Row Level Security on the `entries` table ensures users only touch their own rows.
 */
export function useEntries() {
  const { user } = useAuth();
  const journal = useJournal();

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      journal.setEntries([]);
      journal.setLoading(false);
      return;
    }

    let cancelled = false;
    journal.setLoading(true);

    (async () => {
      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        journal.setEntries((data ?? []).map(fromRow));
        journal.dispatch({ type: 'SET_HAS_MORE', payload: false });
      } catch (err) {
        logger.error('entries load error', err);
        if (!cancelled) journal.setError('Failed to load entries from Supabase');
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load more (future pagination) ─────────────────────────────────────────
  const loadMore = useCallback(async () => {
    // Supabase supports range-based pagination; stubbed for now
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const createEntry = useCallback(async (data) => {
    if (!user) return null;

    const wc    = countWords(data.content ?? '');
    const title = data.title?.trim() || generateEntryTitle();
    const now   = toISO();

    const payload = toRow(
      {
        title,
        content:     data.content ?? '',
        mood:        data.mood ?? 'good',
        tags:        data.tags ?? [],
        date:        data.date ?? now,
        wordCount:   wc,
        isPrivate:   data.isPrivate ?? false,
        aiInsight:   null,
        codeSnippet: data.codeSnippet ?? '',
        updatedAt:   now,
      },
      user.id
    );

    try {
      const { data: rows, error } = await supabase
        .from('entries')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      const newEntry = fromRow(rows);
      journal.addEntry(newEntry);
      await updateStatsOnEntry(user.id, wc);
      return newEntry.id;
    } catch (err) {
      logger.error('createEntry error', err);
      toast.error('Failed to save entry');
      return null;
    }
  }, [user, journal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update ────────────────────────────────────────────────────────────────
  const updateEntry = useCallback(async (id, data) => {
    if (!user) return false;

    const wc  = countWords(data.content ?? '');
    const now = toISO();

    const patch = toRow({ ...data, wordCount: wc, updatedAt: now });

    try {
      const { error } = await supabase
        .from('entries')
        .update(patch)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      journal.updateEntry({ id, ...data, wordCount: wc, updatedAt: now });
      return true;
    } catch (err) {
      logger.error('updateEntry error', err);
      toast.error('Failed to update entry');
      return false;
    }
  }, [user, journal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteEntry = useCallback(async (id) => {
    if (!user) return false;

    const entry     = journal.entries.find((e) => e.id === id);
    const wordCount = entry?.wordCount ?? 0;

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      journal.deleteEntry(id);
      await updateStatsOnDelete(user.id, wordCount);
      return true;
    } catch (err) {
      logger.error('deleteEntry error', err);
      toast.error('Failed to delete entry');
      return false;
    }
  }, [user, journal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Get single entry ──────────────────────────────────────────────────────
  const getEntry = useCallback(async (id) => {
    if (!user) return null;

    // Check in-memory cache first
    const cached = journal.entries.find((e) => e.id === id);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return fromRow(data);
    } catch (err) {
      logger.error('getEntry error', err);
      return null;
    }
  }, [user, journal.entries]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save AI Insight ───────────────────────────────────────────────────────
  const saveInsight = useCallback(async (id, insight) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('entries')
        .update({ ai_insight: insight, updated_at: toISO() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      journal.setInsight(id, insight);
      return true;
    } catch (err) {
      logger.error('saveInsight error', err);
      return false;
    }
  }, [user, journal]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    entries: journal.entries,
    loading: journal.loading,
    error:   journal.error,
    hasMore: journal.hasMore,
    loadMore,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    saveInsight,
  };
}
