import Order from "@/components/screens/Order/Order";
import { useGetOrderByIdQuery } from "@/services/orders/orders.service";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";

const index = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isError, error, isLoading } = useGetOrderByIdQuery(
    parseInt(id)
  );
  if (isError) {
    return <Text>{"amsdc" + error.message}</Text>;
  }
  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }
  return <Order order={data} />;
};

export default index;
