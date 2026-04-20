import { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useJournal } from '../context/JournalContext';
import { updateStatsOnEntry, updateStatsOnDelete } from '../services/analyticsService';
import { countWords } from '../utils/markdownParser';
import { generateEntryTitle, toISO } from '../utils/dateHelpers';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'devjournal_entries';

/**
 * Abstracts all entry CRUD operations using LocalStorage (removed Firebase).
 */
export function useEntries() {
  const { user } = useAuth();
  const journal = useJournal();

  // Helper to get entries from local storage
  const getLocalEntries = useCallback(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }, []);

  // Helper to save entries to local storage
  const saveLocalEntries = useCallback((entries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, []);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      journal.setEntries([]);
      journal.setLoading(false);
      return;
    }

    journal.setLoading(true);
    try {
      const entries = getLocalEntries();
      // Sort by date desc
      const sorted = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      journal.setEntries(sorted);
      journal.dispatch({ type: 'SET_HAS_MORE', payload: false }); // Local storage doesn't need pagination for now
    } catch (err) {
      logger.error('entries load error', err);
      journal.setError('Failed to load local entries');
    } finally {
      journal.setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load more (pagination placeholder) ──────────────────────────────────────
  const loadMore = useCallback(async () => {
    // No-op for local storage in this implementation
  }, []);

  // ── Create ──────────────────────────────────────────────────────────────────
  const createEntry = useCallback(async (data) => {
    if (!user) return null;

    const wc = countWords(data.content ?? '');
    const title = data.title?.trim() || generateEntryTitle();
    const now = toISO();

    const newEntry = {
      id: `local-${Date.now()}`,
      title,
      content: data.content ?? '',
      mood: data.mood ?? 'good',
      tags: data.tags ?? [],
      date: data.date ?? now,
      wordCount: wc,
      isPrivate: data.isPrivate ?? false,
      aiInsight: null,
      codeSnippet: data.codeSnippet ?? '',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const entries = getLocalEntries();
      const updated = [newEntry, ...entries];
      saveLocalEntries(updated);
      
      journal.addEntry(newEntry);
      await updateStatsOnEntry(user.uid, wc);
      return newEntry.id;
    } catch (err) {
      toast.error('Failed to save entry locally');
      return null;
    }
  }, [user, journal, getLocalEntries, saveLocalEntries]);

  // ── Update ──────────────────────────────────────────────────────────────────
  const updateEntry = useCallback(async (id, data) => {
    if (!user) return false;

    try {
      const entries = getLocalEntries();
      const wc = countWords(data.content ?? '');
      const now = toISO();
      
      const updated = entries.map(entry => {
        if (entry.id === id) {
          return {
            ...entry,
            ...data,
            wordCount: wc,
            updatedAt: now,
            title: (data.title !== undefined && !data.title.trim()) ? generateEntryTitle() : (data.title ?? entry.title)
          };
        }
        return entry;
      });

      saveLocalEntries(updated);
      journal.updateEntry({ id, ...data, wordCount: wc, updatedAt: now });
      return true;
    } catch (err) {
      toast.error('Failed to update entry locally');
      return false;
    }
  }, [user, journal, getLocalEntries, saveLocalEntries]);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteEntry = useCallback(async (id) => {
    if (!user) return false;

    try {
      const entries = getLocalEntries();
      const entry = entries.find((e) => e.id === id);
      const wc = entry?.wordCount ?? 0;

      const filtered = entries.filter(e => e.id !== id);
      saveLocalEntries(filtered);
      
      journal.deleteEntry(id);
      await updateStatsOnDelete(user.uid, wc);
      return true;
    } catch (err) {
      toast.error('Failed to delete entry locally');
      return false;
    }
  }, [user, journal, getLocalEntries, saveLocalEntries]);

  // ── Get single entry ────────────────────────────────────────────────────────
  const getEntry = useCallback(async (id) => {
    if (!user) return null;
    const entries = getLocalEntries();
    return entries.find((e) => e.id === id) || null;
  }, [user, getLocalEntries]);

  // ── Save AI Insight ─────────────────────────────────────────────────────────
  const saveInsight = useCallback(async (id, insight) => {
    if (!user) return false;
    
    try {
      const entries = getLocalEntries();
      const updated = entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, aiInsight: insight, updatedAt: toISO() };
        }
        return entry;
      });
      
      saveLocalEntries(updated);
      journal.setInsight(id, insight);
      return true;
    } catch (err) {
      logger.error('saveInsight error', err);
      return false;
    }
  }, [user, journal, getLocalEntries, saveLocalEntries]);

  return {
    entries: journal.entries,
    loading: journal.loading,
    error: journal.error,
    hasMore: journal.hasMore,
    loadMore,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    saveInsight,
  };
}
