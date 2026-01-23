import RouteItem from "@/components/shared/RouteItem";
import MyButton from "@/components/ui/Button/Button";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { colors } from "@/constants/colors";
import { IAddress } from "@/types/order.interface";
import yandexMaps from "@/utils/yandexMaps";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

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
      console.error(error);
    }
  };

  if (route.length === 0)
    return (
      <View style={styles.container}>
        <ThemedText weight="medium" type="mediumText">
          Маршрут пуст
        </ThemedText>
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
          <MyButton
            buttonText="Открыть маршрут на карте"
            onPress={openRoute}
            color="purple"
          />
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
  address: {
    flex: 1,
  },
});

export default Route;
