import { normalizeTag } from '../constants/tags';

/**
 * Parse a comma/space-separated tag string into an array of normalized tags.
 * @param {string} input
 * @returns {string[]}
 */
export const parseTagInput = (input) => {
  return input
    .split(/[,\s]+/)
    .map(normalizeTag)
    .filter(Boolean);
};

/**
 * Merge existing tags with new ones, deduplicating.
 * @param {string[]} existing
 * @param {string[]} incoming
 * @returns {string[]}
 */
export const mergeTags = (existing, incoming) => {
  return [...new Set([...existing, ...incoming.map(normalizeTag)])];
};

/**
 * Toggle a tag in/out of an array.
 * @param {string[]} current
 * @param {string} tag
 * @returns {string[]}
 */
export const toggleTag = (current, tag) => {
  const normalized = normalizeTag(tag);
  return current.includes(normalized)
    ? current.filter((t) => t !== normalized)
    : [...current, normalized];
};

/**
 * Get top N tags from a list of entries by frequency.
 * @param {Array<{tags: string[]}>} entries
 * @param {number} n
 * @returns {Array<{tag: string, count: number}>}
 */
export const getTopTags = (entries, n = 5) => {
  const counts = {};
  entries.forEach(({ tags = [] }) => {
    tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag, count]) => ({ tag, count }));
};
