import Order from "@/components/screens/Order/Order";
import { useGetOrderByIdQuery } from "@/services/orders/orders.service";
import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isError, isLoading } = useGetOrderByIdQuery(parseInt(id));
  if (isError) {
    return <Redirect href={{ pathname: "/(tabs)/orders/main" }} />;
  }
  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }
  return <Order order={data} />;
};

export default index;
