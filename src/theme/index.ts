import { lightTheme, darkTheme, AppTheme } from './themes.ts';

export { lightTheme, darkTheme } from './themes.ts';
export type { AppTheme } from './themes.ts';

export { ThemeProvider, useTheme } from './ThemeProvider.tsx';

export const theme = lightTheme; // Export a default theme object