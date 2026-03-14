import React, { FC, ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTheme } from '@/hooks/useTheme';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost';
type ButtonColor = 'primary' | 'error' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface IProps extends Omit<TouchableOpacityProps, 'onPress' | 'style'> {
  /**
   * Текст кнопки
   */
  buttonText?: string;

  /**
   * Обработчик нажатия
   */
  onPress: () => void;

  /**
   * Вариант отображения кнопки
   * @default 'filled'
   */
  variant?: ButtonVariant;

  /**
   * Цветовая схема кнопки
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Размер кнопки
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Состояние загрузки
   */
  isLoading?: boolean;

  /**
   * Иконка слева от текста
   */
  leftIcon?: ReactNode;

  /**
   * Иконка справа от текста
   */
  rightIcon?: ReactNode;

  /**
   * Кнопка только с иконкой (без текста)
   */
  iconOnly?: boolean;

  /**
   * Кнопка на всю ширину
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Дополнительные стили для кнопки
   */
  style?: StyleProp<ViewStyle>;
}

export const Button: FC<IProps> = ({
  buttonText,
  onPress,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  fullWidth = true,
  children,
  style,
  ...rest
}) => {
  const { colors } = useTheme();

  // Маппинг цветов на семантические цвета темы
  const colorMap = {
    primary: {
      main: colors.primary,
      active: colors.primaryActive,
      light: colors.primaryLight,
      text: colors.textOnPrimary,
    },
    error: {
      main: colors.error,
      hover: colors.errorHover,
      light: colors.errorLight,
      text: colors.textOnPrimary,
    },
    success: {
      main: colors.success,
      hover: colors.success,
      light: colors.success,
      text: colors.text,
    },
  };

  const currentColor = colorMap[color];

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: disabled ? colors.border : currentColor.main,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.border : currentColor.main,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'ghost':
        return {
          backgroundColor: disabled ? colors.backgroundSecondary : currentColor.light,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  // Стили в зависимости от размера
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 40,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
      case 'medium':
        return {
          height: 56,
          paddingHorizontal: 20,
          borderRadius: 20,
        };
      case 'large':
        return {
          height: 64,
          paddingHorizontal: 24,
          borderRadius: 24,
        };
      default:
        return {};
    }
  };

  // Цвет текста в зависимости от варианта
  const getTextColor = (): 'primary' | 'error' | 'success' | 'onPrimary' => {
    if (disabled) return 'primary';

    switch (variant) {
      case 'filled':
        return 'onPrimary';
      case 'outlined':
      case 'text':
      case 'ghost':
        return color as 'primary' | 'error' | 'success';
      default:
        return 'primary';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          color={variant === 'filled' ? currentColor.text : currentColor.main}
          size={size === 'small' ? 'small' : 'large'}
        />
      );
    }

    return (
      <View style={styles.contentWrapper}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        {!iconOnly && buttonText && (
          <ThemedText
            type={size === 'small' ? 'default' : 'mediumText'}
            weight='bold'
            color={getTextColor()}
            style={styles.buttonText}
          >
            {buttonText}
          </ThemedText>
        )}

        {children}

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      accessibilityLabel={buttonText}
      accessibilityRole='button'
      accessibilityState={{ disabled: disabled || isLoading }}
      style={[
        styles.baseButton,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        iconOnly && styles.iconOnly,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  fullWidth: {
    width: '100%',
  },
  iconOnly: {
    width: 56,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    textAlign: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
