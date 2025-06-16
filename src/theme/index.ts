import { lightTheme, darkTheme, AppTheme } from './themes.ts';

declare module '@react-navigation/native' {
  export function useTheme(): AppTheme;
}

export { lightTheme, darkTheme } from './themes.ts';
export type { AppTheme } from './themes.ts';

export { ThemeProvider, useTheme } from './ThemeProvider.tsx';
