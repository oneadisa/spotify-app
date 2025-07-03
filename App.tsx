import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PlaylistProvider } from './src/contexts/PlaylistContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, AppState, AppStateStatus } from 'react-native';
import { AdvancedAudioService } from './src/services/audioService';
import Toast from 'react-native-toast-message';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  if (authLoading) {
    return null; // Or a loading indicator
  }

  return (
    <PlaylistProvider>
      <AppNavigator isAuthenticated={isAuthenticated} />
      <Toast />
      <StatusBar style="light" />
    </PlaylistProvider>
  );
}

export default function App() {
  // Initialize audio service when app starts
  useEffect(() => {
    let isMounted = true;

    const initializeAudio = async () => {
      try {
        await AdvancedAudioService.initialize();
        console.log('Audio service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio service:', error);
      }
    };

    if (isMounted) {
      initializeAudio();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      // Cleanup audio service if needed
      AdvancedAudioService.stopPreview();
    };
  }, []);

  // Handle app state changes for audio
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        try {
          await AdvancedAudioService.initialize();
        } catch (error) {
          console.error('Error reinitializing audio:', error);
        }
      } else if (nextAppState === 'background') {
        // App has gone to the background
        try {
          await AdvancedAudioService.stopPreview();
        } catch (error) {
          console.error('Error stopping audio:', error);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
