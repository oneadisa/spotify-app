import { useTheme as useAppTheme } from '../theme/ThemeProvider';
import { AppTheme } from '../theme/themes';

export const useTheme = (): AppTheme => {
  return useAppTheme();
};
