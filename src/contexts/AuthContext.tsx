import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../config/spotify';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  getValidToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    refreshToken,
    expiresIn,
    login: spotifyLogin,
    logout: spotifyLogout,
    refreshAccessToken: spotifyRefreshToken,
    getValidToken,
  } = useSpotifyAuth();

  const [authError, setAuthError] = useState<string | null>(null);

  // Check if token is expired
  const isTokenExpired = useCallback((expiration: number | null) => {
    if (!expiration) return true;
    return Date.now() >= expiration * 1000;
  }, []);

  // Handle login
  const login = useCallback(async () => {
    try {
      setAuthError(null);
      await spotifyLogin();
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Failed to log in');
    }
  }, [spotifyLogin]);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      await spotifyLogout();
      setAuthError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setAuthError('Failed to log out');
    }
  }, [spotifyLogout]);

  // Handle token refresh
  const refreshAccessToken = useCallback(async () => {
    try {
      const newToken = await spotifyRefreshToken();
      setAuthError(null);
      return newToken;
    } catch (err) {
      console.error('Token refresh error:', err);
      setAuthError('Failed to refresh token');
      return null;
    }
  }, [spotifyRefreshToken]);

  // Check authentication status on mount and when tokens change
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) return;
      
      if (accessToken && expiresIn && !isTokenExpired(expiresIn)) {
        // Already authenticated by useSpotifyAuth
        return;
      } else if (refreshToken) {
        // Try to refresh the token if it's expired but we have a refresh token
        await refreshAccessToken();
      }
    };

    checkAuth();
  }, [accessToken, refreshToken, expiresIn, isAuthenticated, isTokenExpired, refreshAccessToken]);

  // Effect to handle token refresh before it expires
  useEffect(() => {
    if (!expiresIn || !refreshToken) return;

    const timeUntilExpiry = expiresIn * 1000 - Date.now();
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry

    if (timeUntilExpiry <= refreshThreshold) {
      // Token is about to expire, refresh it
      refreshAccessToken();
    } else {
      // Set a timeout to refresh the token before it expires
      const timeoutId = setTimeout(() => {
        refreshAccessToken();
      }, timeUntilExpiry - refreshThreshold);

      return () => clearTimeout(timeoutId);
    }
  }, [expiresIn, refreshToken, refreshAccessToken]);

  const contextValue = React.useMemo(() => ({
    isAuthenticated: !!isAuthenticated,
    isLoading,
    error: error || authError || null,
    accessToken,
    refreshToken,
    expiresIn,
    login,
    logout,
    refreshAccessToken,
    getValidToken,
  }), [
    isAuthenticated, 
    isLoading, 
    error, 
    authError, 
    accessToken, 
    refreshToken, 
    expiresIn, 
    login, 
    logout, 
    refreshAccessToken, 
    getValidToken
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
