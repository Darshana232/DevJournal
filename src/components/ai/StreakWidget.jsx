import { cn } from '../../utils/cn';

/**
 * Streak display widget — shows current streak with fire emoji.
 * @param {number} currentStreak
 * @param {number} longestStreak
 */
export function StreakWidget({ currentStreak = 0, longestStreak = 0 }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-elevated border border-border rounded-md">
      <div className="flex flex-col items-center min-w-0">
        <span className="text-2xl leading-none">🔥</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-lg text-text-primary leading-none">
          {currentStreak}
          <span className="text-sm text-text-secondary font-sans ml-1">
            {currentStreak === 1 ? 'day streak' : 'day streak'}
          </span>
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          Longest: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
        </p>
      </div>
      {currentStreak >= 7 && (
        <span className="text-2xs font-mono text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded">
          on fire
        </span>
      )}
    </div>
  );
}
