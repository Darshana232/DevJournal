/**
 * analyticsService.js
 *
 * Computes writing stats (streak, total words, total entries) from the
 * in-memory entries array. This means no separate stats table in Supabase
 * is needed — everything is derived on the fly from data we already have.
 *
 * The updateStatsOnEntry / updateStatsOnDelete functions are kept for
 * backward compatibility with useEntries.js call sites, but now they
 * simply update an in-memory store rather than localStorage.
 */

import { isSameCalendarDay, daysBetween } from '../utils/dateHelpers';
import { logger } from '../utils/logger';

// In-memory stats store — keyed by user id
const statsStore = {};

function defaultStats() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastEntryDate: null,
    totalWords:    0,
    totalEntries:  0,
  };
}

/**
 * Compute full stats directly from an entries array.
 * Useful for the Insights page — call this with the already-loaded entries.
 *
 * @param {Array}  entries  - Array of entry objects (camelCase)
 * @returns {Object}        - { currentStreak, longestStreak, totalWords, totalEntries, lastEntryDate }
 */
export function computeStatsFromEntries(entries) {
  if (!entries || entries.length === 0) return defaultStats();

  // Sort oldest → newest for streak calculation
  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let prevDate      = null;
  let totalWords    = 0;

  for (const entry of sorted) {
    totalWords += entry.wordCount ?? 0;

    const entryDate = new Date(entry.createdAt);

    if (!prevDate) {
      currentStreak = 1;
    } else if (isSameCalendarDay(prevDate, entryDate)) {
      // Multiple entries same day — don't double-count streak
    } else if (daysBetween(prevDate, entryDate) === 1) {
      currentStreak += 1;
    } else {
      // Gap in days — reset
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    prevDate      = entryDate;
  }

  // Check if streak is still active (last entry was today or yesterday)
  const lastDate = prevDate;
  if (lastDate && daysBetween(lastDate, new Date()) > 1) {
    currentStreak = 0; // streak broken
  }

  return {
    currentStreak,
    longestStreak,
    totalWords,
    totalEntries:  entries.length,
    lastEntryDate: sorted[sorted.length - 1]?.createdAt ?? null,
  };
}

/**
 * Initialize in-memory stats for a user (no-op if already initialized).
 * @param {string} uid
 */
export async function initStats(uid) {
  if (!statsStore[uid]) {
    statsStore[uid] = defaultStats();
  }
}

/**
 * Fetch in-memory stats for a user.
 * @param {string} uid
 * @returns {Promise<Object>}
 */
export async function getStats(uid) {
  return statsStore[uid] ?? null;
}

/**
 * Update in-memory stats when a new entry is created.
 * @param {string} uid
 * @param {number} wordCount
 */
export async function updateStatsOnEntry(uid, wordCount) {
  if (!statsStore[uid]) statsStore[uid] = defaultStats();

  const data = statsStore[uid];
  const now  = new Date();
  const lastDate = data.lastEntryDate ? new Date(data.lastEntryDate) : null;

  let { currentStreak, longestStreak } = data;

  if (lastDate) {
    if (isSameCalendarDay(lastDate, now)) {
      // Same day — totals only, no streak change
    } else if (daysBetween(lastDate, now) === 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  statsStore[uid] = {
    currentStreak,
    longestStreak,
    lastEntryDate: now.toISOString(),
    totalWords:    (data.totalWords ?? 0) + wordCount,
    totalEntries:  (data.totalEntries ?? 0) + 1,
  };

  logger.log('Stats updated (in-memory):', { currentStreak, longestStreak });
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
  if (!statsStore[uid]) return;
  const data = statsStore[uid];
  statsStore[uid] = {
    ...data,
    totalEntries: Math.max(0, (data.totalEntries ?? 1) - 1),
    totalWords:   Math.max(0, (data.totalWords ?? wordCount) - wordCount),
  };
}
