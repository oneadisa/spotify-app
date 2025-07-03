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

  console.log('AuthProvider: useSpotifyAuth state - isAuthenticated:', isAuthenticated, 'accessToken:', !!accessToken);

  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0); // Force context updates

  // Fetch profile helper
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setProfile(null);
      setProfileImage(null);
      return;
    }
    
    try {
      console.log('Fetching profile...');
      const user = await apiRequest(`${SPOTIFY_CONFIG.apiBaseUrl}/me`);
      console.log('Profile fetched:', user);
      setProfile(user);
      if (user && Array.isArray(user.images) && user.images.length > 0 && user.images[0]?.url) {
        console.log('Setting profile image to:', user.images[0].url);
        setProfileImage(user.images[0].url);
        setForceUpdate(prev => prev + 1); // Force context update
      } else {
        console.log('No profile image found, setting to null');
        setProfileImage(null);
        setForceUpdate(prev => prev + 1); // Force context update
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
      setProfile(null);
      setProfileImage(null);
    }
  }, [isAuthenticated, accessToken]);

  // Fetch profile when authentication state changes
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'accessToken:', !!accessToken);
    if (isAuthenticated && accessToken) {
      // Fetch profile immediately when authentication is complete
      fetchProfile();
    } else {
      setProfile(null);
      setProfileImage(null);
    }
  }, [isAuthenticated, accessToken, fetchProfile]);

  // Handle login
  const login = useCallback(async () => {
    try {
      setAuthError(null);
      console.log('Starting login process...');
      await spotifyLogin();
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Failed to log in');
    }
  }, [spotifyLogin]);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
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

  useEffect(() => {
    if (error) {
      console.log('Auth error:', error);
    }
  }, [error]);

  const contextValue = React.useMemo(() => {
    console.log('AuthContext: Creating context value - isAuthenticated:', !!isAuthenticated, 'profileImage:', profileImage, 'forceUpdate:', forceUpdate);
    return {
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
    };
  }, [
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
    forceUpdate, // Include forceUpdate in dependencies
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
