import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface IProps {
  initialSeconds: number;
  onExpire: () => void;
}

const LOW_TIME_THRESHOLD = 10;

export const OfferTimer: FC<IProps> = ({ initialSeconds, onExpire }) => {
  const { colors } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds, onExpire]);

  const isLowTime = secondsLeft <= LOW_TIME_THRESHOLD;

  return (
    <View style={styles.timerRow}>
      <ThemedText type='mediumText' weight='medium' align='left'>
        Время на решение:
      </ThemedText>
      <View
        style={[styles.timerBadge, { backgroundColor: isLowTime ? colors.error : colors.primary }]}
      >
        <ThemedText type='mediumText' weight='bold' color='onPrimary'>
          {secondsLeft}с
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    minWidth: 56,
    alignItems: 'center',
  },
});
