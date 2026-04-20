import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * @param {string} label - Visible label above the input
 * @param {string} error - Validation error message
 * @param {string} hint  - Helper text below the input
 * @param {boolean} fullWidth
 */
export const Input = forwardRef(function Input(
  { label, error, hint, fullWidth = true, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs text-text-secondary font-medium tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-elevated border rounded px-3 py-2',
          'text-sm text-text-primary font-sans',
          'placeholder:text-text-secondary/50',
          'focus:outline-none focus:border-accent',
          'transition-colors duration-150',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-text-secondary mt-0.5">{hint}</p>}
    </div>
  );
});
