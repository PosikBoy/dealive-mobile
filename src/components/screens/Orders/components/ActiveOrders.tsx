import React from 'react';
import { View } from 'react-native';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import { OrdersListLayout } from '@/components/shared/OrdersListLayout/OrdersListLayout';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useActiveOrders } from '@/domain/orders/api';

import AvailableOrders from './AvailableOrders';

const ActiveOrders = () => {
  const { data, isLoading, refetch, isFetching } = useActiveOrders();

  // Кастомный компонент для пустого состояния
  const emptyComponent = (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 20 }}>
        <ThemedText weight='medium'>
          Похоже, что у вас нет активных заказов на данный момент. Вы можете выбрать подходящий из
          списка ниже!
        </ThemedText>
      </View>
      <AvailableOrders />
    </View>
  );

  return (
    <OrdersListLayout
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      renderItem={item => <OrderPreview order={item} />}
      keyExtractor={item => item.id.toString()}
      emptyComponent={emptyComponent}
      refetchButtonBottom={130}
    />
  );
};

export default ActiveOrders;
