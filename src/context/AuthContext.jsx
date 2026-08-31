import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, logoutUser, fetchCurrentUser, refreshSession } from '../api/authApi';
import { setAccessToken, clearAccessToken, setOnAuthFailure } from '../lib/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // If the refresh cookie is still valid (e.g. from a previous visit), this
  // silently mints a fresh access token so the user doesn't have to log in
  // again just because they reloaded the page or opened a new tab.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const { accessToken } = await refreshSession();
        setAccessToken(accessToken);
        const { user: me } = await fetchCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        clearAccessToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  // The axios layer lives outside React. When a background request's token
  // refresh fails (cookie expired/revoked mid-session), it calls this to
  // drop the app back to logged-out state.
  useEffect(() => {
    setOnAuthFailure(() => setUser(null));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { user: loggedInUser, accessToken } = await loginUser({ email, password });
    setAccessToken(accessToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { user: newUser, accessToken } = await registerUser({ name, email, password });
    setAccessToken(accessToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Cookie may already be gone server-side — clear local state regardless.
    }
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isInitializing,
        login,
        register,
        logout,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
