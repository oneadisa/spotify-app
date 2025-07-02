import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../config/spotify';
import { View, Text, Button } from 'react-native';
import { apiRequest } from '../utils/api';
import { SPOTIFY_CONFIG } from '../config/spotify';

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
  profile: any | null;
  profileImage: string | null;
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
  const [profile, setProfile] = useState<any | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Check if token is expired
  const isTokenExpired = useCallback((expiration: number | null) => {
    if (!expiration) return true;
    return Date.now() >= expiration * 1000;
  }, []);

  // Fetch profile helper
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      setProfileImage(null);
      return;
    }
    try {
      const user = await apiRequest(`${SPOTIFY_CONFIG.apiBaseUrl}/me`);
      setProfile(user);
      if (user && Array.isArray(user.images) && user.images.length > 0 && user.images[0]?.url) {
        setProfileImage(user.images[0].url);
      } else {
        setProfileImage(null);
      }
    } catch (e) {
      setProfile(null);
      setProfileImage(null);
    }
  }, [isAuthenticated]);

  // Fetch profile on login, logout, or token change
  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated, accessToken, refreshToken, fetchProfile]);

  // Handle login
  const login = useCallback(async () => {
    try {
      setAuthError(null);
      await spotifyLogin();
      await fetchProfile();
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Failed to log in');
    }
  }, [spotifyLogin, fetchProfile]);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      await spotifyLogout();
      setAuthError(null);
      setProfile(null);
      setProfileImage(null);
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

  useEffect(() => {
    if (error) {
      console.log('Auth error:', error);
    }
  }, [error]);

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
    profile,
    profileImage,
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
    getValidToken,
    profile,
    profileImage,
  ]);

  if (contextValue.error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: 'red', fontSize: 18, marginBottom: 16 }}>Authentication failed.</Text>
        <Text style={{ color: '#333', marginBottom: 24 }}>{contextValue.error}</Text>
        <Button title="Retry Login" onPress={login} />
      </View>
    );
  }

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
