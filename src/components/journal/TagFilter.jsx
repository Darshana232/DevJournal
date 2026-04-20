import { useState, useCallback } from 'react';
import { Badge } from '../ui/Badge';
import { PREDEFINED_TAGS } from '../../constants/tags';
import { TAG_COLORS } from '../../constants/tags';
import { MOODS } from '../../constants/moods';
import { cn } from '../../utils/cn';

/**
 * Filter bar: search input + tag pills + mood filter + sort order.
 * @param {{ search: string, tags: string[], moods: string[], sort: 'newest'|'oldest' }} filters
 * @param {Function} onChange
 */
export function TagFilter({ filters, onChange }) {
  const handleSearch = useCallback((e) => {
    onChange({ search: e.target.value });
  }, [onChange]);

  const handleTagToggle = useCallback((tag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ tags: next });
  }, [filters.tags, onChange]);

  const handleMoodToggle = useCallback((mood) => {
    const next = filters.moods.includes(mood)
      ? filters.moods.filter((m) => m !== mood)
      : [...filters.moods, mood];
    onChange({ moods: next });
  }, [filters.moods, onChange]);

  const clearAll = useCallback(() => {
    onChange({ search: '', tags: [], moods: [], sort: 'newest' });
  }, [onChange]);

  const hasFilters = filters.search || filters.tags.length || filters.moods.length;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Search + Sort */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs pointer-events-none">
            /
          </span>
          <input
            id="entry-search"
            type="text"
            placeholder="Search entries…"
            value={filters.search}
            onChange={handleSearch}
            className={cn(
              'w-full bg-elevated border border-border rounded',
              'pl-6 pr-3 py-2 text-sm font-mono text-text-primary',
              'placeholder:text-border focus:outline-none focus:border-accent',
              'transition-colors'
            )}
          />
        </div>
        <select
          id="entry-sort"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className={cn(
            'bg-elevated border border-border rounded',
            'px-3 py-2 text-sm text-text-secondary font-mono',
            'focus:outline-none focus:border-accent transition-colors',
            'cursor-pointer'
          )}
        >
          <option value="newest">newest</option>
          <option value="oldest">oldest</option>
        </select>
        {hasFilters && (
          <button
            id="clear-filters"
            onClick={clearAll}
            className="text-xs text-text-secondary hover:text-danger transition-colors font-mono px-2"
          >
            clear
          </button>
        )}
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-1.5">
        {PREDEFINED_TAGS.slice(0, 10).map((tag) => {
          const active = filters.tags.includes(tag);
          return (
            <button
              key={tag}
              id={`filter-tag-${tag}`}
              onClick={() => handleTagToggle(tag)}
              className={cn(
                'px-2 py-0.5 text-2xs font-mono rounded border transition-colors duration-150',
                active
                  ? 'bg-accent/10 border-accent/40 text-accent'
                  : 'border-border text-text-secondary hover:bg-elevated'
              )}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Mood filter */}
      <div className="flex items-center gap-1.5">
        {MOODS.map(({ value, emoji, label }) => {
          const active = filters.moods.includes(value);
          return (
            <button
              key={value}
              id={`filter-mood-${value}`}
              onClick={() => handleMoodToggle(value)}
              title={label}
              aria-label={`Filter by ${label}`}
              className={cn(
                'w-7 h-7 rounded border text-sm transition-all duration-150',
                'flex items-center justify-center',
                active
                  ? 'border-accent bg-accent/10 scale-110'
                  : 'border-border hover:bg-elevated'
              )}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
