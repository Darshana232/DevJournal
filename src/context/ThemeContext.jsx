import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
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

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme]);

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
