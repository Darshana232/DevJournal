/**
 * @param {string} title - Page heading
 * @param {string} subtitle - Optional subtitle
 * @param {React.ReactNode} actions - Right-side action buttons
 */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-mono text-2xl text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-0.5">{actions}</div>
      )}
    </div>
  );
}
