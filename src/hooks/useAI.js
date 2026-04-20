import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { generateEntryInsight, generateWeeklyDigest } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { toISO } from '../utils/dateHelpers';

/**
 * Handles AI insight generation and weekly digest calls.
 */
export function useAI() {
  const { user }                  = useAuth();
  const [loadingInsight, setLoadingInsight]   = useState(false);
  const [loadingDigest, setLoadingDigest]     = useState(false);
  const [insightError, setInsightError]       = useState(null);

  /**
   * Generate and return an insight object for a journal entry.
   * @param {string} content
   * @returns {Promise<{reflection:string,suggestion:string,question:string,generatedAt:string}|null>}
   */
  const getInsight = useCallback(async (content) => {
    if (!content?.trim()) {
      toast.error('Entry is empty — nothing to analyze.');
      return null;
    }
    if (content.trim().split(/\s+/).length < 10) {
      toast.error('Write at least 10 words before generating an insight.');
      return null;
    }

    setLoadingInsight(true);
    setInsightError(null);

    try {
      const insight = await generateEntryInsight(content);
      const result  = { ...insight, generatedAt: toISO() };
      return result;
    } catch (err) {
      logger.error('getInsight error', err);
      const msg = err.message || 'Failed to generate insight.';
      setInsightError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoadingInsight(false);
    }
  }, []);

  /**
   * Generate a weekly digest from an array of entries.
   * @param {Array} entries
   * @returns {Promise<string|null>}
   */
  const getWeeklyDigest = useCallback(async (entries) => {
    if (!entries?.length) {
      toast.error('No entries this week to summarize.');
      return null;
    }

    setLoadingDigest(true);

    try {
      const digest = await generateWeeklyDigest(
        entries.map((e) => ({
          title:   e.title,
          content: e.content,
          mood:    e.mood,
          date:    e.date,
        }))
      );
      return digest;
    } catch (err) {
      logger.error('getWeeklyDigest error', err);
      toast.error(err.message || 'Failed to generate weekly digest.');
      return null;
    } finally {
      setLoadingDigest(false);
    }
  }, []);

  return { loadingInsight, loadingDigest, insightError, getInsight, getWeeklyDigest };
}
