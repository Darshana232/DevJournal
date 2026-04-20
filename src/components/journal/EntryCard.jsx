import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { formatEntryDate } from '../../utils/dateHelpers';
import { getMoodEmoji } from '../../utils/moodUtils';
import { TAG_COLORS } from '../../constants/tags';
import { cn } from '../../utils/cn';

/**
 * @param {import('../../context/JournalContext').Entry} entry
 * @param {string} className
 */
export function EntryCard({ entry, className }) {
  const navigate = useNavigate();

  // Build 2-line preview: strip markdown syntax chars
  const preview = (entry.content ?? '')
    .replace(/#{1,3} /g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim()
    .slice(0, 160);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/entry/${entry.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`Open entry: ${entry.title}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/entry/${entry.id}`)}
      className={cn(
        'group flex flex-col gap-3 p-4 rounded-md border border-border',
        'bg-surface hover:bg-elevated hover:border-border',
        'cursor-pointer transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        className
      )}
    >
      {/* Title */}
      <h2 className="font-mono text-md text-text-primary leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-150">
        {entry.title || 'Untitled Entry'}
      </h2>

      {/* Content preview */}
      {preview && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">
          {preview}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        {/* Date */}
        <span className="text-xs text-text-secondary font-sans shrink-0">
          {formatEntryDate(entry.date || entry.createdAt)}
        </span>

        {/* Tags */}
        <div className="flex items-center gap-1 overflow-hidden flex-1 justify-center">
          {(entry.tags ?? []).slice(0, 3).map((tag) => (
            <Badge key={tag} className="shrink-0" style={{ borderColor: TAG_COLORS[tag] ? `${TAG_COLORS[tag]}30` : undefined, color: TAG_COLORS[tag] }}>
              #{tag}
            </Badge>
          ))}
          {(entry.tags?.length ?? 0) > 3 && (
            <span className="text-2xs text-text-secondary">+{entry.tags.length - 3}</span>
          )}
        </div>

        {/* Mood */}
        <span
          className="text-base leading-none shrink-0"
          aria-label={`Mood: ${entry.mood}`}
          title={entry.mood}
        >
          {getMoodEmoji(entry.mood)}
        </span>
      </div>
    </motion.article>
  );
}
