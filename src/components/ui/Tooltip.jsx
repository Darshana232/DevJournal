import { useState, useRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * @param {string} content - Tooltip text
 * @param {'top'|'bottom'|'left'|'right'} position
 * @param {React.ReactNode} children - The element to wrap
 */
export function Tooltip({ content, position = 'top', children, className }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  };
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 whitespace-nowrap',
            'text-xs font-sans text-text-primary',
            'bg-elevated border border-border rounded',
            'pointer-events-none animate-fade-in',
            positions[position]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
