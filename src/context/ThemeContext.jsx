import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devlog-theme') ?? 'dark';
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark',  theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    localStorage.setItem('devlog-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    // Persist to Firestore if logged in
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { theme: next });
      } catch {
        // Non-critical — localStorage already updated
      }
    }
  }, [theme, user]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** @returns {{ theme: 'dark'|'light', toggleTheme: Function }} */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
