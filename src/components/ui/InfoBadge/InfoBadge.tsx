import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { palette } from '@/constants/colors';

export interface IInfoBadgeProps {
  icon?: React.ReactNode;
  label: string;
  backgroundColor: string;
  textColor?: string;
  flex?: boolean;
}

export const InfoBadge: FC<IInfoBadgeProps> = ({
  icon,
  label,
  backgroundColor,
  textColor = palette.white,
  flex = false,
}) => (
  <View style={[styles.badge, { backgroundColor }, flex && styles.flex]}>
    {icon}
    <ThemedText style={[styles.text, { color: textColor }]} weight='medium' numberOfLines={1}>
      {label}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  flex: {
    flex: 1,
    minWidth: 72,
    maxWidth: '48%',
  },
  text: {
    fontSize: 13,
    flexShrink: 1,
  },
});
