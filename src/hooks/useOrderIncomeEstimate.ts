import { useMemo } from 'react';

import { IOrder } from '@/domain/orders/types';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { routeService } from '@/services/route/route.service';
import {
  calculateOrderIncomeEstimate,
  IOrderIncomeEstimate,
} from '@/utils/calculateOrderIncomeEstimate';

export type { IOrderIncomeEstimate };

/**
 * Calculates estimated income per hour for a given order
 * based on the current route state and courier location.
 */
export const useOrderIncomeEstimate = (order: IOrder | undefined): IOrderIncomeEstimate | null => {
  const routeState = useTypedSelector(state => state.route);
  const locationLat = useTypedSelector(state => state.location.lat);
  const locationLon = useTypedSelector(state => state.location.lon);
  const isLocationLoading = useTypedSelector(state => state.location.isLocationLoading);

  return useMemo(() => {
    if (!order || isLocationLoading) return null;

    const location = { lat: locationLat, lon: locationLon };
    const newRoute = routeService.getRouteWithNewOrder([...routeState.route], order, location);

    return calculateOrderIncomeEstimate(order.price, newRoute.distance, routeState.distance || 0);
  }, [order, routeState, locationLat, locationLon, isLocationLoading]);
};
