import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { icons } from '@/constants/icons';
import { useTheme } from '@/hooks/useTheme';

interface RefetchButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  bottom?: number;
}

export const RefetchButton: React.FC<RefetchButtonProps> = ({
  onPress,
  isLoading = false,
  style,
  bottom = 50,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.background, bottom }, style]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.primary} />
      ) : (
        <Image tintColor={colors.tint} source={icons.refetch} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});
