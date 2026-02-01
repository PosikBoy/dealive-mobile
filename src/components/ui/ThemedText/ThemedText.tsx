import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface IProps extends PropsWithChildren<TextProps> {
  weight?: 'semiBold' | 'bold' | 'medium' | 'regular';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'onPrimary';
  type?: 'heading' | 'title' | 'subtitle' | 'default' | 'hint' | 'big' | 'mediumText';
  align?: 'left' | 'center';
  key?: React.Key;
}

export const ThemedText = (props: IProps) => {
  const {
    children,
    weight = 'regular',
    color = 'primary',
    style,
    type = 'default',
    align = 'center',
    ...rest
  } = props;

  const { colors } = useTheme();

  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    error: colors.error,
    success: colors.success,
    onPrimary: colors.textOnPrimary,
  };

  const textColor = colorMap[color];

  return (
    <Text
      {...rest}
      style={[styles[weight], styles[type], styles[align], { color: textColor }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  regular: {
    fontFamily: 'CeraRoundPro-Regular',
  },
  semiBold: {
    fontFamily: 'CeraRoundPro-SemiBold',
  },
  medium: {
    fontFamily: 'CeraRoundPro-Medium',
  },
  bold: {
    fontFamily: 'CeraRoundPro-Bold',
  },
  default: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  heading: {
    fontSize: 16,
  },
  big: {
    fontSize: 18,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 20,
  },
  hint: {
    fontSize: 12,
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
});
