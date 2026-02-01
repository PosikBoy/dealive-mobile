import { ColorSchemeName, useColorScheme } from 'react-native';

import { colors } from '@/constants/colors';

type Theme = ColorSchemeName;

export const useTheme = () => {
  const defaultTheme: Theme = 'light';

  const colorTheme = useColorScheme();
  const theme = colorTheme || defaultTheme;

  return {
    theme,
    colors: theme === 'light' ? colors.light : colors.dark,
  };
};
