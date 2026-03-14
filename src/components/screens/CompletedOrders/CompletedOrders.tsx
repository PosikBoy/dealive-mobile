import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import { Header } from '@/components/shared/Header/Header';
import { OrdersListLayout } from '@/components/shared/OrdersListLayout/OrdersListLayout';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { orderStatuses } from '@/constants/orderStatuses';
import { useAllOrders } from '@/domain/orders/api';
import { useTheme } from '@/hooks/useTheme';

const CompletedOrders = () => {
  const { colors } = useTheme();
  const { data: orders, isLoading, refetch, isFetching } = useAllOrders();

  const completedOrders = useMemo(
    () => orders?.filter(order => order.statusId === orderStatuses.delivered) || [],
    [orders],
  );

  // Кастомный компонент для пустого состояния
  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <ThemedText weight='medium' type='mediumText' style={styles.emptyText}>
          Похоже, что вы еще не выполнили ни одного заказа
        </ThemedText>
        <View style={styles.searchOrderContainer}>
          <Image source={icons.noOrders} style={styles.emptyImage} resizeMode='cover' />
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title='Завершенные заказы' />
      <View style={styles.ordersContainer}>
        <OrdersListLayout
          data={completedOrders}
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
          renderItem={item => <OrderPreview order={item} />}
          keyExtractor={item => item.id.toString()}
          emptyComponent={emptyComponent}
          refetchButtonBottom={50}
        />
      </View>
    </View>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    gap: 10,
  },
  ordersContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  searchOrderContainer: {
    height: 256,
    width: 256,
  },
  emptyImage: {
    width: '100%',
    height: '100%',
  },
});
