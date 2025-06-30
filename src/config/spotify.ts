// Spotify API Configuration
import Constants from 'expo-constants';

// Define the shape of our environment variables
type Env = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REDIRECT_URI: string;
};

// Cast the Constants.manifest to include our extra config
const extra = (Constants.expoConfig as any)?.extra as Partial<Env> || {};

// Use Constants.manifest.extra in development, process.env in production
const ENV: Env = {
  SPOTIFY_CLIENT_ID: extra.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || '',
  SPOTIFY_CLIENT_SECRET: extra.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET || '',
  SPOTIFY_REDIRECT_URI: extra.SPOTIFY_REDIRECT_URI || process.env.SPOTIFY_REDIRECT_URI || 'exp://localhost:19000/--/spotify-auth',
};

export const SPOTIFY_CONFIG = {
  clientId: ENV.SPOTIFY_CLIENT_ID,
  clientSecret: ENV.SPOTIFY_CLIENT_SECRET,
  redirectUri: ENV.SPOTIFY_REDIRECT_URI,
  scopes: [
    // User details
    'user-read-email',
    'user-read-private',
    
    // Playback
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-read-recently-played',
    
    // Library
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-follow-read',
    
    // Playlists
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    
    // Streaming
    'streaming',
    'app-remote-control',
    
    // Listening history
    'user-read-playback-position',
    'user-read-recently-played',
  ],
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  apiBaseUrl: 'https://api.spotify.com/v1',
};

// Token storage keys for secure storage
export const STORAGE_KEYS = {
  // Spotify authentication
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  TOKEN_EXPIRATION: 'spotify_token_expiration',
  TOKEN_TIMESTAMP: 'spotify_token_timestamp',
  
  // App preferences
  THEME_PREFERENCE: 'app_theme_preference',
  
  // User data
  USER_PROFILE: 'user_profile',
  RECENTLY_PLAYED: 'recently_played',
  SAVED_TRACKS: 'saved_tracks',
  PLAYBACK_STATE: 'playback_state',
};
