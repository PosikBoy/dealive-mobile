import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import routeService from "@/services/route/route.service";
import { IAddress } from "@/types/order.interface";
import { useState, useEffect } from "react";

const useRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState<IAddress[]>();
  const [distance, setDistance] = useState<number>();
  const [isReroute, setIsReroute] = useState(false);
  const reroute = () => {
    setIsReroute(!isReroute);
  };
  const { data: orders, isLoading: isGetActiveOrdersLoading } =
    useGetActiveOrdersQuery();

  useEffect(() => {
    if (!isGetActiveOrdersLoading && orders) {
      const addresses = orders.map((order) => order.addresses);
      const flatAddresses = addresses.flat();
      const result = routeService.getRoute(flatAddresses);

      setRoute(result.route);
      setDistance(result.distance);
      setIsLoading(false);
    }
  }, [isGetActiveOrdersLoading, orders, isReroute]); // <- хук будет срабатывать только при изменении этих зависимостейr

  return { route, isLoading, distance, reroute };
};

export default useRoute;
