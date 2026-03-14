import { useMemo, useRef, useState } from 'react';
import { ActionSheetRef } from 'react-native-actions-sheet';

import { IOrder } from '@/domain/orders/types';

export const sortingRuleOptions = ['lastDate', 'priceASC', 'priceDESC', 'distance'] as const;

export const sortingRulesOptionsText = {
  lastDate: 'По дате (сначала новые)',
  priceASC: 'По цене (от дешевых к дорогим)',
  priceDESC: 'По цене (от дорогих к дешевым)',
  distance: 'По расстоянию (ближайший)',
};

export type SortingRulesTypes = (typeof sortingRuleOptions)[number];

export const useOrdersSorting = (orders: IOrder[] | undefined) => {
  const [sortingRules, setSortingRules] = useState<SortingRulesTypes>('lastDate');
  const sortingRulesModalRef = useRef<ActionSheetRef>(null);

  const sortedOrders = useMemo(() => {
    return orders
      ? [...orders].sort((a, b) => {
          switch (sortingRules) {
            case 'priceASC':
              return a.price - b.price;
            case 'priceDESC':
              return b.price - a.price;
            case 'distance':
              return a.addresses[0].distance - b.addresses[0].distance;
            case 'lastDate':
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            default:
              return 0;
          }
        })
      : [];
  }, [orders, sortingRules]);

  const handleSortingRulePress = (type: SortingRulesTypes) => {
    setSortingRules(type);
    sortingRulesModalRef.current?.hide();
  };

  return {
    sortedOrders,
    sortingRules,
    sortingRulesModalRef,
    handleSortingRulePress,
  };
};
