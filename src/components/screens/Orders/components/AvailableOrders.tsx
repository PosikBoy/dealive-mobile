import React from 'react';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import { OrdersListLayout } from '@/components/shared/OrdersListLayout/OrdersListLayout';
import { useAvailableOrders } from '@/domain/orders/api';

import {
  sortingRuleOptions,
  sortingRulesOptionsText,
  useOrdersSorting,
} from '../hooks/useOrdersSorting';

const AvailableOrders = () => {
  const { data, isLoading, refetch, isFetching } = useAvailableOrders();

  const { sortedOrders, sortingRulesModalRef, handleSortingRulePress } = useOrdersSorting(data);

  return (
    <OrdersListLayout
      data={sortedOrders}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      renderItem={item => <OrderPreview order={item} />}
      keyExtractor={item => item.id.toString()}
      emptyMessage='Похоже, что сейчас мы не можем порекомендовать вам заказы'
      showSortButton={true}
      sortingRulesModalRef={sortingRulesModalRef}
      sortingRuleOptions={sortingRuleOptions}
      sortingRulesOptionsText={sortingRulesOptionsText}
      onSortingRulePress={handleSortingRulePress}
      refetchButtonBottom={50}
    />
  );
};

export default AvailableOrders;
