/** Predefined tag list — users can also add custom tags */
export const PREDEFINED_TAGS = [
  'leetcode',
  'interview',
  'bug',
  'learning',
  'project',
  'career',
  'productivity',
  'architecture',
  'devops',
  'frontend',
  'backend',
  'debugging',
  'review',
  'planning',
  'meeting',
  'open-source',
  'reading',
];

export const TAG_COLORS = {
  leetcode:     '#6366f1',
  interview:    '#f59e0b',
  bug:          '#ef4444',
  learning:     '#22c55e',
  project:      '#818cf8',
  career:       '#f97316',
  productivity: '#06b6d4',
  architecture: '#a78bfa',
  devops:       '#84cc16',
  frontend:     '#38bdf8',
  backend:      '#fb923c',
  debugging:    '#f87171',
  review:       '#a3e635',
  planning:     '#c084fc',
  meeting:      '#67e8f9',
  'open-source':'#4ade80',
  reading:      '#fbbf24',
};

/** Normalize a tag string */
export const normalizeTag = (tag) =>
  tag.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
