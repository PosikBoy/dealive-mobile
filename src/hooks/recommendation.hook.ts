import { useGetAvailableOrdersQuery } from "@/services/orders/orders.service";
import { useEffect, useState } from "react";
import { useTypedSelector } from "./redux.hooks";
import { IOrder } from "@/types/order.interface";
import routeService from "@/services/route/route.service";

const AVERAGE_SPEED_KMH = 12;

interface IRecommendedOrders {
  order: IOrder;
  weight: number;
  delta: number;
  incomePerHour: number;
  time: number;
}

const useRecommendedOrders = () => {
  const { data: orders = [], isLoading } = useGetAvailableOrdersQuery();

  const routeState = useTypedSelector((state) => state.route);
  const location = useTypedSelector((state) => state.location);

  const [recommendedOrders, setRecommendedOrders] = useState<
    IRecommendedOrders[]
  >([]);

  useEffect(() => {
    if (!orders.length || location.isLocationLoading || isLoading) {
      setRecommendedOrders([]);
      return;
    }

    const calculatedOrders = orders.map((order) => {
      const newRoute = routeService.getRouteWithNewOrder(
        [...routeState.route],
        order,
        location
      );

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

    const sorted = [...calculatedOrders].sort(
      (a, b) => b.incomePerHour - a.incomePerHour
    );
    setRecommendedOrders(sorted);
  }, [orders, routeState, location]);

  return {
    recommendedOrders,
    isLoading: isLoading || location.isLocationLoading,
  };
};

export default useRecommendedOrders;
