import { IOrder } from "@/types/order.interface";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Address from "./Address";
import { colors } from "@/constants/colors";
import formatDate from "@/helpers/formatDate";
import MyButton from "@/components/ui/Button/Button";
import yandexMaps from "@/utils/yandexMaps";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

type Props = {
  order: IOrder;
  activeAddressId: number;
};

const Addresses = (props: Props) => {
  const { order, activeAddressId } = props;

  const openRoute = async () => {
    try {
      const points = order.addresses.map((address) =>
        yandexMaps.getPoint(address)
      );

      yandexMaps.getRoute(points);
    } catch (error) {
      console.log(error);
    }
  };

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
            <MyButton
              buttonText="Открыть маршрут на карте"
              onPress={openRoute}
              color="purple"
            />
            <View style={styles.creationDateContainer}>
              <ThemedText type="mediumText" weight="medium">
                {`Создан ${formatDate(order.date)}`}
              </ThemedText>
            </View>
            {order.statusId == 5 && (
              <ThemedText type="title">Заказ завершен, спасибо!</ThemedText>
            )}
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
    paddingVertical: 20,
    borderRadius: 20,
  },
});
