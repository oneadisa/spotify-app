import { DefaultTheme } from '@react-navigation/native';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  buttonText: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  divider: string;
  overlay: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  dark: boolean;
}

export const lightTheme: AppTheme = {
  colors: {
    primary: '#1DB954',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    textSecondary: '#333333',
    border: '#E0E0E0',
    notification: '#1DB954',
    buttonText: '#FFFFFF',
    error: '#FF4D4D',
    success: '#1DB954',
    warning: '#FFB74D',
    info: '#64B5F6',
    divider: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.05)',
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
  dark: false,
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  colors: {
    primary: '#1DB954',
    background: '#000000',
    card: '#121212',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#333333',
    notification: '#1DB954',
    buttonText: '#FFFFFF',
    error: '#FF6B6B',
    success: '#1DB954',
    warning: '#FFB74D',
    info: '#64B5F6',
    divider: 'rgba(255, 255, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: true,
};

// AppTheme type is now defined as an interface above
