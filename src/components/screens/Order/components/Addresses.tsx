import { IOrder } from "@/types/order.interface";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Address from "./Address";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import formatDate from "@/helpers/formatDate";
import MyButton from "@/components/ui/Button/Button";

type Props = {
  order: IOrder;
  activeAddressId: number;
};

const Addresses = (props: Props) => {
  const { order, activeAddressId } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={order.addresses}
        renderItem={({ item, index }) => (
          <Address
            address={item}
            index={index}
            price={order.price}
            isActive={item.id == activeAddressId}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          gap: 10,
          paddingTop: 10,
          paddingBottom: 150,
        }}
        ListFooterComponent={
          <>
            <View style={styles.creationDateContainer}>
              <Text style={styles.creationDateText}>
                {"Создан " + formatDate(order.date)}
              </Text>
            </View>
            {order.statusId == 5 && (
              <Text style={styles.orderCompleted}>
                Заказ завершен, спасибо!
              </Text>
            )}
            {/* {order.statusId == 4 && (
              <MyButton
                buttonText="Отменить заказ"
                onPress={() => {}}
                color="red"
              />
            )} */}
          </>
        }
        ListFooterComponentStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
    paddingHorizontal: 10,
  },
  creationDateContainer: {
    backgroundColor: colors.white,
    paddingVertical: 20,
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
