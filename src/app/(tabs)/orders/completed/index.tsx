import { View, Text } from "react-native";
import React, { useEffect } from "react";
import CompletedOrders from "@/components/screens/CompletedOrders/CompletedOrders";

type Props = {};

const index = (props: Props) => {
  return (
    <View>
      <CompletedOrders />
    </View>
  );
};

export default index;
