import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { logger } from '../utils/logger';

const AuthContext = createContext(null);

/**
 * Real Auth Provider backed by Supabase Auth.
 *
 * Provides: user, loading, register, login, logout
 * Sessions are persisted by Supabase automatically (localStorage token).
 * onAuthStateChange fires on page load, login, logout, and token refresh.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until session is resolved

  // ── Session listener ───────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Restore session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Subscribe to future auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  /**
   * Creates a new user with email + password.
   * We store displayName in user_metadata so it's accessible via user.user_metadata.full_name.
   */
  const register = async (email, password, displayName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: displayName },
        },
      });
      if (error) throw error;
      logger.log('Supabase signUp success', data.user?.email);
      return { success: true };
    } catch (err) {
      logger.error('register error', err);
      return { success: false, error: err.message };
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      logger.log('Supabase signIn success', data.user?.email);
      return { success: true };
    } catch (err) {
      logger.error('login error', err);
      return { success: false, error: err.message };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      logger.error('logout error', err);
      return { success: false, error: err.message };
    }
  };

  // Convenience getter — matches the shape the rest of the app expects
  const userProfile = user
    ? {
        uid:         user.id,
        id:          user.id,
        email:       user.email,
        displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Developer',
        photoURL:    user.user_metadata?.avatar_url ?? null,
      }
    : null;

  const value = { user: userProfile, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
