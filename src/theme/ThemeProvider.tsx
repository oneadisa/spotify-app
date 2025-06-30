import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme, AppState, AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { darkTheme, lightTheme, AppTheme } from './themes';
import { STORAGE_KEYS } from '../config/spotify';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType extends AppTheme {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  ...lightTheme,
  themePreference: 'system',
  setThemePreference: async () => {},
  isDarkMode: false,
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await SecureStore.getItemAsync(STORAGE_KEYS.THEME_PREFERENCE);
        if (savedPreference && ['light', 'dark', 'system'].includes(savedPreference)) {
          setThemePreferenceState(savedPreference as ThemePreference);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsReady(true);
      }
    };

    loadThemePreference();
  }, []);

  // Handle app state changes to update theme if system preference changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && themePreference === 'system') {
        // Force re-render when app comes to foreground to check for system theme changes
        setThemePreferenceState('system');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [themePreference]);

  // Set theme based on preference and system setting
  const { theme, isDarkMode } = useMemo(() => {
    const effectiveTheme = themePreference === 'system'
      ? systemColorScheme === 'dark'
        ? darkTheme
        : lightTheme
      : themePreference === 'dark'
        ? darkTheme
        : lightTheme;

    return {
      theme: effectiveTheme,
      isDarkMode: effectiveTheme.dark,
    };
  }, [themePreference, systemColorScheme]);

  // Save theme preference to secure storage
  const setThemePreference = useCallback(async (preference: ThemePreference) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.THEME_PREFERENCE, preference);
      setThemePreferenceState(preference);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  }, []);

  // Don't render children until theme is loaded to avoid flash of incorrect theme
  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        ...theme,
        themePreference,
        setThemePreference,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper hook for components that need to know just the current theme
// without the theme changing functionality
export const useAppTheme = (): AppTheme => {
  const { colors, spacing, borderRadius, dark } = useTheme();
  return useMemo(() => ({
    colors,
    spacing,
    borderRadius,
    dark,
  }), [colors, spacing, borderRadius, dark]);
};

export default ThemeProvider;