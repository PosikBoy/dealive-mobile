import { useEffect, useState } from 'react';

import { useAvailableOrders } from '@/domain/orders/api';
import { IOrder } from '@/domain/orders/types';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { routeService } from '@/services/route/route.service';

const AVERAGE_SPEED_KMH = 12;

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

      const currentDistance = routeState.distance || 0;
      const deltaDistance = newRoute.distance - currentDistance;
      const safeDelta = Math.max(deltaDistance, 0.1);
      const timeHours = safeDelta / AVERAGE_SPEED_KMH;
      const safeTime = Math.max(timeHours, 0.167);
      const incomePerHour = Number((order.price / safeTime).toFixed(2));

      return {
        order,
        weight: order.price / safeDelta,
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
