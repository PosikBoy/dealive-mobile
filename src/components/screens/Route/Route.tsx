import { View, Text, StyleSheet } from "react-native";
import React from "react";

import { fonts } from "@/constants/styles";
import useRoute from "@/hooks/route.hook";
import MyButton from "@/components/ui/Button/Button";
import yandexMaps from "@/utils/yandexMaps";

const Route = () => {
  const { route, isLoading, distance, reroute } = useRoute();
  const openRoute = async () => {
    try {
      const points = route.map((address) => yandexMaps.getPoint(address));

      yandexMaps.getRoute(points);
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <Text>Loading...</Text>;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {route.map((address) => (
          <Text key={address.id}>
            {address.address + address.type + address.orderId}
          </Text>
        ))}
        <Text>{distance}</Text>
        <MyButton
          buttonText="Открыть маршрут на карте"
          onPress={openRoute}
          color="purple"
        />
        <MyButton
          buttonText="Пересчитать маршрут"
          onPress={reroute}
          color="red"
        />
      </View>
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  header: {
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
});
