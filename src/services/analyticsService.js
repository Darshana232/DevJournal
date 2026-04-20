import { isSameCalendarDay, daysBetween, toISO } from '../utils/dateHelpers';
import { logger } from '../utils/logger';

const STATS_KEY_PREFIX = 'devjournal_stats_';

/**
 * Get internal storage key for stats
 */
function getStatsKey(uid) {
  return `${STATS_KEY_PREFIX}${uid}`;
}

/**
 * Initialize stats for a new user in LocalStorage.
 * @param {string} uid
 */
export async function initStats(uid) {
  const key = getStatsKey(uid);
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      currentStreak: 0,
      longestStreak: 0,
      lastEntryDate: null,
      totalWords: 0,
      totalEntries: 0,
      createdAt: new Date().toISOString(),
    }));
  }
}

/**
 * Fetch stats for a user from LocalStorage.
 * @param {string} uid
 * @returns {Promise<Object>}
 */
export async function getStats(uid) {
  const key = getStatsKey(uid);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Update streak and stats after a new entry is saved.
 * @param {string} uid
 * @param {number} wordCount - Words in the new entry
 */
export async function updateStatsOnEntry(uid, wordCount) {
  const key = getStatsKey(uid);
  const rawData = localStorage.getItem(key);
  const now = new Date();

  if (!rawData) {
    const newData = {
      currentStreak: 1,
      longestStreak: 1,
      lastEntryDate: toISO(now),
      totalWords: wordCount,
      totalEntries: 1,
    };
    localStorage.setItem(key, JSON.stringify(newData));
    return;
  }

  const data = JSON.parse(rawData);
  const lastDate = data.lastEntryDate ? new Date(data.lastEntryDate) : null;

  let currentStreak = data.currentStreak ?? 0;
  let longestStreak = data.longestStreak ?? 0;

  if (lastDate) {
    if (isSameCalendarDay(lastDate, now)) {
      // Same day — just update totals, no streak change
    } else if (daysBetween(lastDate, now) === 1) {
      // Consecutive day — increment streak
      currentStreak += 1;
    } else {
      // Missed days — reset streak
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  const updatedData = {
    ...data,
    currentStreak,
    longestStreak,
    lastEntryDate: toISO(now),
    totalWords: (data.totalWords ?? 0) + wordCount,
    totalEntries: (data.totalEntries ?? 0) + 1,
  };

  localStorage.setItem(key, JSON.stringify(updatedData));
  logger.log('Stats updated locally:', { currentStreak, longestStreak });
}

/**
 * Check if streak was broken (last entry > 1 day ago).
 * @param {Object} stats
 * @returns {boolean}
 */
export function isStreakBroken(stats) {
  if (!stats?.lastEntryDate || stats.currentStreak === 0) return false;
  const last = new Date(stats.lastEntryDate);
  return daysBetween(last, new Date()) > 1;
}

/**
 * Decrement totalEntries and totalWords when an entry is deleted.
 * @param {string} uid
 * @param {number} wordCount
 */
export async function updateStatsOnDelete(uid, wordCount) {
  const key = getStatsKey(uid);
  const rawData = localStorage.getItem(key);
  if (!rawData) return;

  const data = JSON.parse(rawData);
  const updatedData = {
    ...data,
    totalEntries: Math.max(0, (data.totalEntries ?? 1) - 1),
    totalWords: Math.max(0, (data.totalWords ?? wordCount) - wordCount),
  };

  localStorage.setItem(key, JSON.stringify(updatedData));
}
