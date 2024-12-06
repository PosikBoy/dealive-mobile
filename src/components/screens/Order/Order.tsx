import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import React, { FC } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { router } from "expo-router";

import formatDate from "@/helpers/formatDate";
import MyButton from "@/components/ui/Button/Button";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import Address from "./components/Address";
import Header from "@/components/ui/Header/Header";

interface IProps {
  order: IOrderWithoutSensitiveInfo | IOrder;
  refetch: () => void;
}

const Order: FC<IProps> = ({ order, refetch }) => {
  const [takeOrder] = useTakeOrderMutation();

  const takeOrderHandle = () => {
    takeOrder({ orderId: order.id });
    refetch();
  };

  return (
    <View style={styles.container}>
      <Header title={"Заказ № " + order.id} />

      <View style={styles.addresses}>
        <FlatList
          data={order.addresses}
          renderItem={({ item, index }) => (
            <Address address={item} index={index} price={order.price} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 20 }}
        />
      </View>
      <View style={styles.creationDate}>
        <Text style={styles.creationDateText}>
          {"Создан " + formatDate(order.date)}
        </Text>
      </View>
      {order.statusId != 3 && (
        <View style={styles.cancelOrderButton}>
          <MyButton
            buttonText="Отменить заказ"
            onPress={() => {}}
            color="red"
          />
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.footerInfo}>
          {order.price + "₽ · " + order.weight + " · " + order.parcelType}
        </Text>
        {order.statusId == 3 && (
          <MyButton buttonText="Взять заказ" onPress={takeOrderHandle} />
        )}
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  addresses: {
    paddingHorizontal: 10,
    width: "100%",
    gap: 20,
  },
  creationDate: {
    paddingHorizontal: 10,
  },
  creationDateText: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    fontSize: 14,
    color: colors.black,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    gap: 10,
    boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.10)",
    backgroundColor: colors.white,
  },
  footerInfo: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
  cancelOrderButton: {
    paddingHorizontal: 10,
  },
});
