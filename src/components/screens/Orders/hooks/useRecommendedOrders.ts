import { useEffect, useState } from 'react';

import { useAvailableOrders } from '@/domain/orders/api';
import { IOrder } from '@/domain/orders/types';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { routeService } from '@/services/route/route.service';
import { calculateOrderIncomeEstimate } from '@/utils/calculateOrderIncomeEstimate';

interface IRecommendedOrders {
  order: IOrder;
  weight: number;
  delta: number;
  incomePerHour: number;
  time: number;
}

export const useRecommendedOrders = () => {
  const { data: orders = [], isLoading, refetch, isFetching } = useAvailableOrders();

  const routeState = useTypedSelector(state => state.route);
  const locationLat = useTypedSelector(state => state.location.lat);
  const locationLon = useTypedSelector(state => state.location.lon);
  const isLocationLoading = useTypedSelector(state => state.location.isLocationLoading);

  const [recommendedOrders, setRecommendedOrders] = useState<IRecommendedOrders[]>([]);

  useEffect(() => {
    if (!orders.length || isLocationLoading || isLoading) {
      setRecommendedOrders([]);
      return;
    }

    const location = { lat: locationLat, lon: locationLon };

    const calculatedOrders = orders.map(order => {
      const newRoute = routeService.getRouteWithNewOrder([...routeState.route], order, location);
      const { incomePerHour, deltaDistance, safeTime } = calculateOrderIncomeEstimate(
        order.price,
        newRoute.distance,
        routeState.distance,
      );

      return {
        order,
        weight: order.price / Math.max(deltaDistance, 0.1),
        delta: deltaDistance,
        incomePerHour,
        time: safeTime,
      };
    });

    const sorted = [...calculatedOrders].sort((a, b) => b.incomePerHour - a.incomePerHour);
    setRecommendedOrders(sorted);
  }, [orders, routeState, locationLat, locationLon, isLocationLoading, isLoading]);

  return {
    recommendedOrders,
    isLoading: isLoading || isLocationLoading,
    refetch,
    isFetching,
  };
};
