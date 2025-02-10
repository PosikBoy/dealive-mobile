import { IOrder } from "@/types/order.interface";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Address from "./Address";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import formatDate from "@/helpers/formatDate";

type Props = {
  order: IOrder;
};

const Addresses = (props: Props) => {
  const { order } = props;
  return (
    <View style={styles.container}>
      <View style={styles.addresses}>
        <FlatList
          data={order.addresses}
          renderItem={({ item, index }) => (
            <Address address={item} index={index} price={order.price} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 200,
            paddingTop: 10,
          }}
        />
      </View>
      <View style={styles.creationDateContainer}>
        <Text style={styles.creationDateText}>
          {"Создан " + formatDate(order.date)}
        </Text>
      </View>
      {order.statusId == 5 && (
        <Text style={styles.orderCompleted}>Заказ завершен, спасибо!</Text>
      )}
      {/* {order.statusId == 4 && (
						<MyButton
							buttonText="Отменить заказ"
							onPress={() => {}}
							color="red"
						/>
					)} */}
    </View>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
  },
  addresses: {
    paddingHorizontal: 10,
    width: "100%",
    gap: 20,
    paddingBottom: 100,
  },
  creationDateContainer: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  creationDateText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  orderCompleted: {
    fontSize: 24,
    color: colors.black,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginTop: 30,
  },
});
