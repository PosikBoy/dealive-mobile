import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import routeService from "@/services/route/route.service";
import { IAddress } from "@/types/order.interface";
import { useState, useEffect } from "react";

const useRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState<IAddress[] | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [sum, setSum] = useState(0);

  const { data: orders, isLoading: isGetActiveOrdersLoading } =
    useGetActiveOrdersQuery();
  console.log("Use Effect");

  useEffect(() => {
    if (!isGetActiveOrdersLoading && orders.length > 0) {
      try {
        const addresses = orders.map((order) => order.addresses);
        const flatAddresses = addresses.flat();
        const result = routeService.getRoute(flatAddresses);
        const sum = orders.reduce((sum, order) => {
          return sum + order.price;
        }, 0);

        setSum(sum);
        setRoute(result.route);
        setDistance(result.distance);
      } catch (error) {
        console.error("Error while calculating route:", error);
      } finally {
      }
    }
    setIsLoading(isGetActiveOrdersLoading);
  }, [isGetActiveOrdersLoading, orders]);
  return { route, isLoading, distance, sum };
};

export default useRoute;
