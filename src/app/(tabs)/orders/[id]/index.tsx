import Order from "@/components/screens/Order/Order";
import { useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";
import { useGetOrderByIdQuery } from "@/services/orders/orders.service";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { Redirect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | IOrderWithoutSensitiveInfo>();
  const location = useTypedSelector((state) => state.location);

  const { data, isError, isLoading } = useGetOrderByIdQuery(parseInt(id));

  useEffect(() => {
    if (data && !location.isLocationLoading) {
      const enrichedOrder = geodataService.enrichOrder(data, location);
      setOrder(enrichedOrder);
    }
  }, [data, location]);

  if (!order || isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  if (isError) {
    return <Redirect href={{ pathname: "/(tabs)/orders/main" }} />;
  }

  return <Order order={order} />;
};

export default index;
