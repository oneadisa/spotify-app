import { useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { SPOTIFY_CONFIG, STORAGE_KEYS } from '../config/spotify';
import { router } from 'expo-router';

// Required for web authentication
WebBrowser.maybeCompleteAuthSession();

// Create redirect URI for the current platform
const redirectUri = AuthSession.makeRedirectUri({
  native: SPOTIFY_CONFIG.redirectUri,
  // @ts-ignore - useProxy is not in the type definition but is supported
  useProxy: Platform.OS !== 'web',
});

// Configure the auth request
const useAuthRequest = () => {
  return AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CONFIG.clientId,
      scopes: SPOTIFY_CONFIG.scopes,
      redirectUri,
      usePKCE: true,
    },
    {
      authorizationEndpoint: SPOTIFY_CONFIG.authEndpoint,
      tokenEndpoint: SPOTIFY_CONFIG.tokenEndpoint,
    }
  );
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  tokenExpiration: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
}

export const useSpotifyAuth = () => {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    tokenExpiration: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isRefreshing: false,
  });

  const [request, response, promptAsync] = useAuthRequest();

  // Update state with a partial state object
  const updateState = (updates: Partial<AuthState>) => {
    console.log('useSpotifyAuth: Updating state with:', updates);
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('useSpotifyAuth: New state:', newState);
      return newState;
    });
  };

  // Load tokens from secure storage on mount
  useEffect(() => {
    const loadTokens = async () => {
      console.log('useSpotifyAuth: Loading tokens from storage...');
      try {
        const [storedAccessToken, storedRefreshToken, storedExpiration] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION),
        ]);

        console.log('useSpotifyAuth: Loaded tokens - accessToken:', !!storedAccessToken, 'refreshToken:', !!storedRefreshToken, 'expiration:', storedExpiration);

        if (storedAccessToken && storedRefreshToken) {
          const expiration = storedExpiration ? parseInt(storedExpiration, 10) : null;
          const isExpired = expiration ? expiration < Date.now() : true;

          console.log('useSpotifyAuth: Token expiration check - expiration:', expiration, 'isExpired:', isExpired);

          updateState({
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            tokenExpiration: expiration,
            isAuthenticated: !isExpired,
            isLoading: false,
          });
        } else {
          console.log('useSpotifyAuth: No stored tokens found');
          updateState({ isLoading: false });
        }
      } catch (err) {
        console.error('Failed to load tokens from storage', err);
        updateState({ 
          error: 'Failed to load authentication data',
          isLoading: false 
        });
      }
    };

    loadTokens();
  }, []);

  // Handle authentication response
  useEffect(() => {
    console.log('useSpotifyAuth: Auth response received:', response?.type);
    if (response?.type === 'success' && 'params' in response && response.params.code) {
      console.log('useSpotifyAuth: Exchanging code for token...');
      exchangeCodeForToken(response.params.code);
    } else if (response?.type === 'error' && 'params' in response) {
      console.log('useSpotifyAuth: Auth error:', response.params.error);
      updateState({ 
        error: `Authentication error: ${response.params.error || 'Unknown error'}`,
        isLoading: false 
      });
    }
  }, [response]);

  // Exchange authorization code for access token
  const exchangeCodeForToken = async (code: string) => {
    if (!request) {
      updateState({ error: 'Missing auth request object' });
      return;
    }
    if (!request.codeVerifier) {
      updateState({ error: 'Missing code verifier' });
      return;
    }

    try {
      updateState({ isLoading: true });
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: SPOTIFY_CONFIG.clientId,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: SPOTIFY_CONFIG.tokenEndpoint,
        }
      );

      if (tokenResponse.accessToken) {
        const expiration = Date.now() + (tokenResponse.expiresIn || 3600) * 1000;
        await Promise.all([
          SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.accessToken),
          SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokenResponse.refreshToken || ''),
          SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION, expiration.toString()),
        ]);
        console.log('Token exchange successful, updating state...');
        updateState({
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken || null,
          expiresIn: tokenResponse.expiresIn || 3600,
          tokenExpiration: expiration,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log('State updated, authentication complete');
        // Navigation will be handled by the AppNavigator based on state changes
      }
    } catch (err) {
      console.error('Failed to exchange code for token', err);
      updateState({ 
        error: 'Failed to complete authentication',
        isLoading: false 
      });
    }
  };

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    if (!state.refreshToken || state.isRefreshing) return null;
    
    try {
      updateState({ isRefreshing: true });
      
      const tokenResponse = await AuthSession.refreshAsync(
        {
          clientId: SPOTIFY_CONFIG.clientId,
          refreshToken: state.refreshToken,
        },
        {
          tokenEndpoint: SPOTIFY_CONFIG.tokenEndpoint,
        }
      );

      if (tokenResponse.accessToken) {
        const expiration = Date.now() + (tokenResponse.expiresIn || 3600) * 1000;
        
        await Promise.all([
          SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.accessToken),
          SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION, expiration.toString()),
        ]);
        
        updateState({
          accessToken: tokenResponse.accessToken,
          expiresIn: tokenResponse.expiresIn || 3600,
          tokenExpiration: expiration,
          isRefreshing: false,
          error: null,
        });
        
        return tokenResponse.accessToken;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to refresh token', err);
      updateState({ 
        error: 'Failed to refresh authentication',
        isRefreshing: false,
      });
      await logout();
      return null;
    }
  }, [state.refreshToken, state.isRefreshing]);

  // Login function
  const login = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      // @ts-ignore - useProxy is not in the type definition but is supported
      await promptAsync();
    } catch (err) {
      console.error('Login error:', err);
      updateState({ 
        error: 'Failed to start authentication',
        isLoading: false 
      });
    }
  }, [promptAsync]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Use individual try-catch for each SecureStore operation
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      } catch (e) {
        console.warn('Failed to delete access token', e);
      }
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      } catch (e) {
        console.warn('Failed to delete refresh token', e);
      }
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION);
      } catch (e) {
        console.warn('Failed to delete token expiration', e);
      }
      updateState({
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        tokenExpiration: null,
        isAuthenticated: false,
        error: null,
      });
      // Navigate to auth screen only if router is available
      try {
        if (router && typeof router.replace === 'function') {
          router.replace('/auth');
        }
      } catch (e) {
        console.warn('Navigation failed during logout', e);
      }
    } catch (err) {
      console.error('Failed to clear authentication data', err);
      updateState({ error: 'Failed to log out' });
    }
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback(async () => {
    try {
      const expiration = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION);
      return !expiration || parseInt(expiration, 10) < Date.now();
    } catch (err) {
      console.error('Failed to check token expiration', err);
      return true;
    }
  }, []);

  // Get valid access token (refreshes if needed)
  const getValidToken = useCallback(async () => {
    if (await isTokenExpired()) {
      return await refreshAccessToken();
    }
    return state.accessToken;
  }, [state.accessToken, isTokenExpired, refreshAccessToken]);

  return {
    ...state,
    login,
    logout,
    refreshAccessToken,
    getValidToken,
  };
};