import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTheme } from '@/hooks/useTheme';

const STRINGS = {
  TITLE: 'Заказ передан другому курьеру',
  SUBTITLE:
    'Время на принятие истекло — заказ ушёл следующему в очереди. Ожидайте новых предложений.',
  CLOSE_BUTTON: 'Понятно',
};

export const OfferExpiredSheet = () => {
  const { colors } = useTheme();

  const handleClose = () => {
    SheetManager.hide('offer-expired-sheet');
  };

  return (
    <ActionSheet
      gestureEnabled={true}
      containerStyle={{ backgroundColor: colors.background }}
      openAnimationConfig={{
        stiffness: 1000,
        damping: 100000,
        mass: 1,
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText type='subtitle' weight='bold'>
          {STRINGS.TITLE}
        </ThemedText>
        <ThemedText type='mediumText'>{STRINGS.SUBTITLE}</ThemedText>
        <Button onPress={handleClose} buttonText={STRINGS.CLOSE_BUTTON} />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
});
