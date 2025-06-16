import { DefaultTheme } from '@react-navigation/native';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1DB954',
    background: '#121212',
    card: '#181818',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#282828',
    notification: '#1DB954',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#000000',
    card: '#121212',
  },
};

export type AppTheme = typeof lightTheme;
