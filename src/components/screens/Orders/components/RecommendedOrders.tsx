import React from 'react';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import { OrdersListLayout } from '@/components/shared/OrdersListLayout/OrdersListLayout';

import { useRecommendedOrders } from '../hooks/useRecommendedOrders';

const RecommendedOrders = () => {
  const { recommendedOrders, isLoading, refetch, isFetching } = useRecommendedOrders();

  return (
    <OrdersListLayout
      data={recommendedOrders}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      renderItem={item => <OrderPreview order={item.order} incomePerHour={item.incomePerHour} />}
      keyExtractor={item => item.order.id.toString()}
      emptyMessage='Похоже, что сейчас мы не можем порекомендовать вам заказы'
      refetchButtonBottom={50}
    />
  );
};

export default RecommendedOrders;
