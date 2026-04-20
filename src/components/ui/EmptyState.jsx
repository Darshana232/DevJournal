import { Button } from './Button';

/**
 * @param {string} title
 * @param {string} description
 * @param {Function} onAction
 * @param {string} actionLabel
 * @param {string} ascii - ASCII art decoration line
 */
export function EmptyState({ title, description, onAction, actionLabel, ascii }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* ASCII art */}
      <pre className="font-mono text-xs text-border leading-relaxed mb-6 select-none">
        {ascii || `
 ___   ___   ___  
|   | |   | |   |
|   | |   | |   |
|___| |___| |___|
        `}
      </pre>
      <p className="font-mono text-md text-text-secondary mb-1">{title}</p>
      {description && (
        <p className="text-sm text-text-secondary/70 max-w-xs mb-6">{description}</p>
      )}
      {onAction && (
        <Button variant="outline" onClick={onAction} id="empty-state-action">
          {actionLabel || 'Get started'}
        </Button>
      )}
    </div>
  );
}
