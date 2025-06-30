import 'dotenv/config';
import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  // Your existing config
  name: 'Spotify Clone',
  slug: 'spotify-clone',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/StartUp-Screen.jpg',
    resizeMode: 'cover',
    backgroundColor: '#000000',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.you.spotifyclone',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#191414',
    },
    package: 'com.you.spotifyclone',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    // These values will be available in your app via Constants.expoConfig.extra
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID, 
    // || 'aef375ea91294119949d77b89c67d5e5',
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    // || 'exp://localhost:19000/--/spotify-auth',
    // Note: Never expose client secret in client-side code in production
    // This is just for development. In production, use a backend service for token exchange
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    // || '31f47984ddfd4a7086dfe570ae83a7dc',
  } as const,
});
