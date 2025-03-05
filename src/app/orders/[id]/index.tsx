import Order from "@/components/screens/Order/Order";
import OrderSkeleton from "@/components/skeletons/OrderSkeleton/OrderSkeleton";
import { useGetOrderByIdQuery } from "@/services/orders/orders.service";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { SheetManager } from "react-native-actions-sheet";

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isError, isLoading } = useGetOrderByIdQuery(+id);

  if (!data || isLoading) {
    return <OrderSkeleton />;
  }

  if (isError) {
    return <Redirect href={{ pathname: "/(tabs)/index" }} />;
  }

  return <Order order={data} />;
};

export default index;
