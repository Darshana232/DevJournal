import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEntries } from '../hooks/useEntries';
import { useStreak } from '../hooks/useStreak';
import { EntryCard } from '../components/journal/EntryCard';
import { TagFilter } from '../components/journal/TagFilter';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';

/** Skeleton loader matching EntryCard shape */
function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-md border border-border bg-surface">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="flex justify-between mt-1">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
    </div>
  );
}

const INITIAL_FILTERS = { search: '', tags: [], moods: [], sort: 'newest' };

export default function Dashboard() {
  const navigate = useNavigate();
  const { entries, loading, hasMore, loadMore } = useEntries();
  const { currentStreak, totalWords, totalEntries } = useStreak();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleFilterChange = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  // Filter + sort in memory (Firestore real-time only gives first page)
  const filtered = useMemo(() => {
    let result = [...entries];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.content?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.includes(q))
      );
    }
    if (filters.tags.length) {
      result = result.filter((e) =>
        filters.tags.every((t) => e.tags?.includes(t))
      );
    }
    if (filters.moods.length) {
      result = result.filter((e) => filters.moods.includes(e.mood));
    }

    result.sort((a, b) => {
      const da = new Date(a.date || a.createdAt);
      const db = new Date(b.date || b.createdAt);
      return filters.sort === 'newest' ? db - da : da - db;
    });

    return result;
  }, [entries, filters]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  }, [loadMore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="max-w-4xl mx-auto"
    >
      <PageHeader
        title="Your Entries"
        subtitle={
          totalEntries
            ? `${totalEntries} ${totalEntries === 1 ? 'entry' : 'entries'} · ${totalWords.toLocaleString()} words`
            : undefined
        }
        actions={
          <Button
            id="new-entry-btn"
            variant="primary"
            size="sm"
            onClick={() => navigate('/new')}
          >
            + New Entry
          </Button>
        }
      />

      <TagFilter filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          ascii={`
 .----------------.
 |  no entries    |
 |   found yet    |
 '----------------'`}
          title="No entries yet. Start writing."
          description={
            filters.search || filters.tags.length || filters.moods.length
              ? 'No entries match your filters.'
              : 'Your journal is empty. Write your first entry.'
          }
          onAction={() => navigate('/new')}
          actionLabel="Write first entry"
        />
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </AnimatePresence>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                id="load-more-btn"
                variant="ghost"
                size="sm"
                loading={loadingMore}
                onClick={handleLoadMore}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
