import {
  IAddress,
  IAddressWithoutSensitiveInfo,
} from "@/types/order.interface";
import React from "react";
import { View } from "react-native";

type Props = {
  addresses: IAddress[] | IAddressWithoutSensitiveInfo[];
};

const Addresses = (props: Props) => {
  return <View>Addresses</View>;
};

export default Addresses;
