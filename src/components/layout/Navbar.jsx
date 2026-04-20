import { NavLink } from 'react-router-dom';

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home',     icon: '⊞' },
  { to: '/new',       label: 'New',      icon: '✦' },
  { to: '/insights',  label: 'Insights', icon: '◈' },
  { to: '/settings',  label: 'Settings', icon: '⚙' },
];

/**
 * Mobile bottom navigation bar — visible only on small screens.
 */
export function Navbar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border">
      <div className="flex items-center justify-around h-14">
        {MOBILE_NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            id={`mobile-nav-${label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-2 transition-colors duration-150 ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`
            }
          >
            <span className="font-mono text-lg leading-none">{icon}</span>
            <span className="text-2xs font-sans">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
