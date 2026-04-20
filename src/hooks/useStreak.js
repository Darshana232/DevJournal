import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats, updateStatsOnEntry, isStreakBroken } from '../services/analyticsService';
import { useJournal } from '../context/JournalContext';
import { logger } from '../utils/logger';

/**
 * Provides streak data and stats for the current user.
 */
export function useStreak() {
  const { user }                = useAuth();
  const { stats, setStats }     = useJournal();
  const [loading, setLoading]   = useState(true);
  const [streakBroken, setStreakBroken] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getStats(user.uid);
      if (data) {
        setStats(data);
        setStreakBroken(isStreakBroken(data));
      }
    } catch (err) {
      logger.error('fetchStats error', err);
    } finally {
      setLoading(false);
    }
  }, [user, setStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    streakBroken,
    currentStreak: stats?.currentStreak ?? 0,
    longestStreak: stats?.longestStreak ?? 0,
    totalWords:    stats?.totalWords ?? 0,
    totalEntries:  stats?.totalEntries ?? 0,
    refetch: fetchStats,
  };
}
