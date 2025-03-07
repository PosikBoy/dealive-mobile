import { View, StyleSheet, FlatList, Text } from "react-native";
import React from "react";
import { IAddress } from "@/types/order.interface";
import Address from "./Address";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import RouteItem from "@/components/shared/RouteItem";
import yandexMaps from "@/utils/yandexMaps";
import MyButton from "@/components/ui/Button/Button";

interface IProps {
  route: IAddress[];
  orderId: number;
}

const Route = (props: IProps) => {
  const { route, orderId } = props;

  const openRoute = async () => {
    try {
      const points = route.map((address) => yandexMaps.getPoint(address));

      yandexMaps.getRoute(points);
    } catch (error) {
      console.log(error);
    }
  };

  if (route.length === 0)
    return (
      <View style={styles.container}>
        <Text style={styles.noRouteText}>Маршрут пуст</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={route}
        renderItem={({ item, index }) => (
          <RouteItem
            address={item}
            index={index}
            isHighlighted={item.orderId == orderId}
          />
        )}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 150,
          width: "100%",
        }}
        keyExtractor={(item) => item.id.toString()}
        style={{
          paddingTop: 10,
          width: "100%",
        }}
        ListFooterComponent={
          <>
            <MyButton
              buttonText="Открыть маршрут на карте"
              onPress={openRoute}
              color="purple"
            />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressIndexContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  addressIndexText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  address: {
    flex: 1,
  },
  noRouteText: {
    marginTop: 20,
    textAlign: "center",
    color: colors.black,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
});

export default Route;
