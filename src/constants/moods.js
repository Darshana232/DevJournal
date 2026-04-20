/** Mood definitions — icon is an emoji, value is the stored enum */
export const MOODS = [
  { value: 'great',    label: 'Great',    emoji: '🚀', color: '#22c55e' },
  { value: 'good',     label: 'Good',     emoji: '😊', color: '#6366f1' },
  { value: 'okay',     label: 'Okay',     emoji: '😐', color: '#f59e0b' },
  { value: 'rough',    label: 'Rough',    emoji: '😓', color: '#f97316' },
  { value: 'terrible', label: 'Terrible', emoji: '💀', color: '#ef4444' },
];

export const MOOD_MAP = Object.fromEntries(MOODS.map(m => [m.value, m]));

export const DEFAULT_MOOD = 'good';
