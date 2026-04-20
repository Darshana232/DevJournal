import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEntries } from '../hooks/useEntries';
import { useStreak } from '../hooks/useStreak';
import { useAI } from '../hooks/useAI';
import { PageHeader } from '../components/layout/PageHeader';
import { MoodChart } from '../components/ai/MoodChart';
import { StreakWidget } from '../components/ai/StreakWidget';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import {
  dominantMood,
  getMoodEmoji,
  getMoodLabel,
} from '../utils/moodUtils';
import { getTopTags } from '../utils/tagUtils';
import {
  currentWeekLabel,
  getLast12Weeks,
  isSameCalendarDay,
} from '../utils/dateHelpers';
import { cn } from '../utils/cn';

/** Heatmap component */
function ContributionHeatmap({ entries }) {
  const weeks = getLast12Weeks();

  return (
    <div className="bg-elevated border border-border rounded-md p-4 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => {
              const count = entries.filter((e) =>
                isSameCalendarDay(new Date(e.date || e.createdAt), day)
              ).length;

              let bg = 'bg-surface'; // 0
              if (count === 1) bg = 'bg-accent/30';
              if (count === 2) bg = 'bg-accent/60';
              if (count >= 3) bg = 'bg-accent';

              return (
                <div
                  key={di}
                  className={cn(
                    'heatmap-cell',
                    bg,
                    count === 0 && 'border border-border/50'
                  )}
                  title={`${count} entries on ${day.toLocaleDateString()}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-2xs text-text-secondary font-mono">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-surface border border-border/50" />
          <div className="w-3 h-3 rounded-sm bg-accent/30" />
          <div className="w-3 h-3 rounded-sm bg-accent/60" />
          <div className="w-3 h-3 rounded-sm bg-accent" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default function Insights() {
  const { entries, loading } = useEntries();
  const { currentStreak, longestStreak } = useStreak();
  const { getWeeklyDigest, loadingDigest } = useAI();

  const [digest, setDigest] = useState(null);

  // Stats computation
  const stats = useMemo(() => {
    if (!entries.length) return null;

    const dom           = dominantMood(entries);
    const top           = getTopTags(entries, 5);
    const words         = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);
    const avgWords      = entries.length ? Math.round(words / entries.length) : 0;

    return { dominantMood: dom, topTags: top, avgWords };
  }, [entries]);

  const handleGenerateDigest = useCallback(async () => {
    const d = await getWeeklyDigest(entries.slice(0, 10)); // send recent 10 max
    if (d) setDigest(d);
  }, [entries, getWeeklyDigest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6 lg:space-y-8"
    >
      <PageHeader
        title="Insights"
        subtitle="Patterns and analytics from your journal."
      />

      {/* Top 3 Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StreakWidget currentStreak={currentStreak} longestStreak={longestStreak} />
        
        <div className="flex flex-col justify-center p-4 bg-elevated border border-border rounded-md">
          <span className="text-xs text-text-secondary font-mono">Most Frequent Mood</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl leading-none">
              {stats?.dominantMood?.emoji || '😐'}
            </span>
            <span className="font-mono text-lg text-text-primary uppercase tracking-tight">
              {stats?.dominantMood?.label || 'None'}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-4 bg-elevated border border-border rounded-md">
          <span className="text-xs text-text-secondary font-mono">Avg Words / Entry</span>
          <div className="mt-1 font-mono text-2xl text-text-primary leading-none">
            {stats?.avgWords || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          <section>
            <h2 className="font-mono text-md text-text-primary mb-3">Mood Trend (30 Days)</h2>
            <div className="bg-elevated border border-border rounded-md p-4">
              <MoodChart entries={entries} />
            </div>
          </section>

          <section>
            <h2 className="font-mono text-md text-text-primary mb-3">Writing Consistency (12 Weeks)</h2>
            <ContributionHeatmap entries={entries} />
          </section>
        </div>

        {/* Right Column (Digest & Tags) */}
        <div className="space-y-6 lg:space-y-8">
          
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-md text-text-primary">Weekly AI Digest</h2>
              <span className="text-2xs text-text-secondary">{currentWeekLabel()}</span>
            </div>
            <div className="bg-elevated border border-border rounded-md p-5 min-h-[160px] flex flex-col">
              <AnimatePresence mode="wait">
                {loadingDigest ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-3 text-text-secondary"
                  >
                    <Spinner size="sm" />
                    <span className="text-xs font-mono">Analyzing week...</span>
                  </motion.div>
                ) : digest ? (
                  <motion.div
                    key="digest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1"
                  >
                    <p className="text-sm text-text-primary leading-relaxed">{digest}</p>
                    <button
                      onClick={() => setDigest(null)}
                      className="mt-4 text-xs font-mono text-text-secondary hover:text-accent transition-colors"
                    >
                      Clear
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
                  >
                    <p className="text-sm text-text-secondary">
                      Generate a summary of your recent patterns and focus areas.
                    </p>
                    <Button variant="primary" size="sm" onClick={handleGenerateDigest}>
                      ✦ Generate Digest
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-md text-text-primary mb-3">Top Tags</h2>
            <div className="bg-elevated border border-border rounded-md p-4">
              {stats?.topTags?.length ? (
                <div className="flex flex-col gap-3">
                  {stats.topTags.map(({ tag, count }) => (
                    <div key={tag} className="flex items-center justify-between">
                      <span className="text-sm font-mono text-text-primary">#{tag}</span>
                      <span className="text-xs text-text-secondary">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary text-center py-4">No tags used yet.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
