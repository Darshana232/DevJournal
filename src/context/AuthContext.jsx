import { createContext, useContext, useEffect, useState } from 'react';
import { logger } from '../utils/logger';

const AuthContext = createContext(null);

/**
 * Mock Auth Provider (Simplified after removing Firebase)
 */
export function AuthProvider({ children }) {
  // Use a local "Guest" user by default
  const [user, setUser]       = useState({
    uid: 'local-user',
    displayName: 'Guest Developer',
    email: 'guest@example.com',
    photoURL: null
  });
  const [loading, setLoading] = useState(false);

  /** Mock Registration */
  const register = async (email, password, displayName) => {
    setUser({ uid: 'local-user', displayName, email });
    return { success: true };
  };

  /** Mock Login */
  const login = async (email, password) => {
    setUser({ uid: 'local-user', displayName: 'Guest Developer', email });
    return { success: true };
  };

  /** Mock Google Login */
  const loginWithGoogle = async () => {
    setUser({ uid: 'local-user', displayName: 'Guest Developer', email: 'guest@example.com' });
    return { success: true };
  };

  /** Mock Logout */
  const logout = async () => {
    setUser(null);
    return { success: true };
  };

  const value = { user, loading, register, login, loginWithGoogle, logout };

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
