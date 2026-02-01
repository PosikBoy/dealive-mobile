import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import Header from '@/components/shared/Header/Header';
import OrderPreviewSkeleton from '@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { orderStatuses } from '@/constants/orderStatuses';
import { useAllOrders } from '@/domain/orders/api';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';

const CompletedOrders = () => {
  const { colors } = useTheme();

  const { data: orders, isLoading } = useAllOrders();

  const location = useTypedSelector(state => state.location);

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
        <Header title='Завершенные заказы' />
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ActivityIndicator size={'large'} color={colors.primary} />
            <ThemedText type='big' weight='bold'>
              {location.isLocationLoading
                ? 'Пытаемся определить ваше местоположение'
                : 'Запрашиваем заказы с сервера'}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  const completedOrders = orders?.filter(order => order.statusId === orderStatuses.delivered) || [];

  return (
    <View style={styles.container}>
      <Header title='Завершенные заказы' />
      <View style={styles.ordersContainer}>
        {completedOrders.length > 0 && (
          <FlashList
            data={completedOrders}
            renderItem={({ item }) => <OrderPreview order={item} />}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.flatListStyles}
            showsVerticalScrollIndicator={false}
          />
        )}
        {completedOrders.length === 0 && (
          <View style={styles.searchOrderContainer}>
            <Image
              source={icons.noOrders}
              style={{ width: '100%', height: '100%' }}
              resizeMode='cover'
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: colors.backgroundColor,
  },
  flatListStyles: {
    paddingTop: 16,
    paddingBottom: 126,
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  searchOrderContainer: {
    marginHorizontal: 'auto',
    marginTop: 100,
    height: 256,
    width: 256,
  },
  loadingContainer: {
    marginTop: 16,
    gap: 20,
  },
  loadingTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 5, // Отступ между элементами
    backgroundColor: 'transparent',
  },
});
