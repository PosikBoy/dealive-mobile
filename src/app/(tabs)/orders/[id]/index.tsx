import Order from "@/components/screens/Order/Order";
import OrderSkeleton from "@/components/skeletons/OrderSkeleton/OrderSkeleton";
import { useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";
import {
  useGetActiveOrdersQuery,
  useGetAvailableOrdersQuery,
  useGetOrderByIdQuery,
} from "@/services/orders/orders.service";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { Redirect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | IOrderWithoutSensitiveInfo>();
  const location = useTypedSelector((state) => state.location);

  const { data: cachedAvailableOrder } = useGetAvailableOrdersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find((order) => order.id === parseInt(id)),
    }),
    pollingInterval: 60 * 1000,
  });

  const { data: cachedActiveOrder } = useGetActiveOrdersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find((order) => order.id === parseInt(id)),
    }),
  });
  const { data, isError, isLoading } = useGetOrderByIdQuery(parseInt(id), {
    skip: !!cachedAvailableOrder || !!cachedActiveOrder,
  });

  useEffect(() => {
    const orderData = cachedAvailableOrder || cachedActiveOrder || data;

    if (orderData && !location.isLocationLoading) {
      const enrichedOrder = geodataService.enrichOrder(orderData, location);

      setOrder(enrichedOrder);
    }
  }, [data, location, cachedAvailableOrder, cachedActiveOrder]);

  if (!order || isLoading) {
    return <OrderSkeleton />;
  }

  if (isError) {
    return <Redirect href={{ pathname: "/(tabs)/orders/main" }} />;
  }

  return <Order order={order} />;
};

export default index;
