import { MOOD_MAP } from '../constants/moods';

/**
 * Get emoji for a mood value
 * @param {string} moodValue
 * @returns {string}
 */
export const getMoodEmoji = (moodValue) => MOOD_MAP[moodValue]?.emoji ?? '😐';

/**
 * Get label for a mood value
 * @param {string} moodValue
 * @returns {string}
 */
export const getMoodLabel = (moodValue) => MOOD_MAP[moodValue]?.label ?? 'Okay';

/**
 * Get hex color for a mood value
 * @param {string} moodValue
 * @returns {string}
 */
export const getMoodColor = (moodValue) => MOOD_MAP[moodValue]?.color ?? '#f59e0b';

/**
 * Convert mood to numeric score for charting (1–5 scale, higher = better)
 * @param {string} moodValue
 * @returns {number}
 */
export const moodToScore = (moodValue) => {
  const scores = { great: 5, good: 4, okay: 3, rough: 2, terrible: 1 };
  return scores[moodValue] ?? 3;
};

/**
 * Get the most frequent mood from an array of entries
 * @param {Array<{mood: string}>} entries
 * @returns {{mood: string, label: string, emoji: string} | null}
 */
export const dominantMood = (entries) => {
  if (!entries.length) return null;
  const counts = {};
  entries.forEach(({ mood }) => {
    if (mood) counts[mood] = (counts[mood] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return null;
  const [moodValue] = top;
  return {
    mood: moodValue,
    label: getMoodLabel(moodValue),
    emoji: getMoodEmoji(moodValue),
  };
};
