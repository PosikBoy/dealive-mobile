import { View, FlatList } from "react-native";
import React from "react";
import { IOrder } from "@/types/order.interface";
import { Action } from "./Action";

type Props = {
  order: IOrder;
};

const Actions = (props: Props) => {
  const { order } = props;

  return (
    <View>
      <FlatList
        data={order.actions}
        renderItem={({ item }) => (
          <Action
            address={order.addresses.find(
              (address) => address.id == item.addressId
            )}
            action={item}
            disabled={order.statusId != 4}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          gap: 10,
          paddingTop: 10,
          paddingBottom: 150,
        }}
      />
    </View>
  );
};

export default Actions;
