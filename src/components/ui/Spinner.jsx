import { cn } from '../../utils/cn';

/**
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {string} className
 */
export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-2',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-border border-t-accent animate-spin',
        sizes[size],
        className
      )}
    />
  );
}
