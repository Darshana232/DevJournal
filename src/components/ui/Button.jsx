import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

/**
 * @param {'primary'|'ghost'|'danger'|'outline'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {string} className
 * @param {React.ReactNode} children
 * @param {string} id
 */
export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className,
  children,
  id,
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-medium leading-none',
    'border transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'select-none cursor-pointer',
  ].join(' ');

  const variants = {
    primary: 'bg-accent hover:bg-accent-hover border-transparent text-white',
    ghost:   'bg-transparent hover:bg-elevated border-transparent text-text-secondary hover:text-text-primary',
    danger:  'bg-danger/10 hover:bg-danger/20 border-danger/30 text-danger',
    outline: 'bg-transparent hover:bg-elevated border-border text-text-primary',
  };

  const sizes = {
    sm: 'h-7 px-3 text-xs rounded',
    md: 'h-8 px-4 text-sm rounded',
    lg: 'h-10 px-5 text-base rounded-md',
  };

  return (
    <button
      id={id}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="xs" />}
      {children}
    </button>
  );
}
