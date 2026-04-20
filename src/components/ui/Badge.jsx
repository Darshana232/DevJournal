import { cn } from '../../utils/cn';

/**
 * @param {'default'|'success'|'warning'|'danger'|'accent'} variant
 * @param {string} className
 * @param {React.ReactNode} children
 */
export function Badge({ variant = 'default', className, children, ...props }) {
  const variants = {
    default: 'bg-elevated text-text-secondary border-border',
    accent:  'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger:  'bg-danger/10 text-danger border-danger/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5',
        'text-2xs font-mono border rounded',
        'leading-none whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
