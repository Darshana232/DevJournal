import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

import { useStreak } from '../../hooks/useStreak';
import { Tooltip } from '../ui/Tooltip';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard',  icon: '⊞' },
  { to: '/new',       label: 'New Entry',  icon: '✦' },
  { to: '/insights',  label: 'Insights',   icon: '◈' },
  { to: '/settings',  label: 'Settings',   icon: '⚙' },
];

/** User avatar showing initials */
function Avatar({ user }) {
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="w-7 h-7 rounded bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-mono text-accent">{initials}</span>
    </div>
  );
}



/**
 * Left sidebar — 240px, fixed on desktop.
 */
export function Sidebar() {
  const { user, logout }       = useAuth();

  const { currentStreak, totalWords } = useStreak();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { success, error } = await logout();
    if (success) {
      navigate('/login');
      toast.success('Signed out');
    } else {
      toast.error(error || 'Logout failed');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-surface border-r border-border fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <span className="font-mono text-lg text-accent tracking-tight">DevLog_</span>
        <p className="text-xs text-text-secondary mt-0.5">developer journal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(' ', '-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-elevated text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`
            }
          >
            <span className="font-mono text-base leading-none w-4 text-center opacity-70">
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Stats widgets */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Streak</span>
          <span className="text-xs font-mono text-warning">
            🔥 {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Total words</span>
          <span className="text-xs font-mono text-text-primary">
            {totalWords.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-3 py-3 border-t border-border flex items-center gap-2">
        <Avatar user={user} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-primary truncate">
            {user?.displayName || 'Developer'}
          </p>
          <p className="text-2xs text-text-secondary truncate">{user?.email}</p>
        </div>
        <Tooltip content="Sign out">
          <button
            id="logout-btn"
            onClick={handleLogout}
            aria-label="Sign out"
            className="p-1.5 text-text-secondary hover:text-danger transition-colors rounded"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
