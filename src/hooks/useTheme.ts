import { ColorSchemeName, useColorScheme } from 'react-native';

import { colors as colorPalette } from '@/constants/colors';

type Theme = ColorSchemeName;

export const useTheme = () => {
  const defaultTheme: Theme = 'light';

  const colorTheme = useColorScheme();
  const theme = colorTheme || defaultTheme;

  return {
    theme,
    colors: theme === 'light' ? colorPalette.light : colorPalette.dark,
  };
};
