import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import OrderPreviewSkeleton from '@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';

import { useRecommendedOrders } from '../hooks/useRecommendedOrders';
import AvailableOrders from './AvailableOrders';

const RecommendedOrders = () => {
  const { colors } = useTheme();

  const location = useTypedSelector(state => state.location);
  const { recommendedOrders, isLoading } = useRecommendedOrders();

  if (location.error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ThemedText type='big' weight='medium'>
              {location.error}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ActivityIndicator size={'large'} color={colors.primary} />
            <ThemedText type='big' weight='medium'>
              {location.isLocationLoading
                ? 'Пытаемся определить ваше местоположение'
                : 'Запрашиваем заказы с сервера'}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (recommendedOrders.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText weight='medium' type='mediumText'>
          Похоже, что сейчас мы не можем порекомендовать вам заказы
        </ThemedText>
        <AvailableOrders />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={recommendedOrders}
        keyExtractor={item => item.order.id.toString()}
        renderItem={({ item }) => (
          <OrderPreview order={item.order} incomePerHour={item.incomePerHour} />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.flatListStyles}
      />
    </View>
  );
};

export default RecommendedOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 5,
  },
  flatListStyles: {
    paddingTop: 16,
    paddingBottom: 126,
  },
  loadingContainer: {
    marginTop: 16,
    gap: 20,
  },
  loadingTextContainer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 5,
    backgroundColor: 'transparent',
  },
});
