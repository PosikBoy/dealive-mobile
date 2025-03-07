import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import { borderRadiuses, fonts, fontSizes } from "@/constants/styles";
import MyButton from "@/components/ui/Button/Button";
import yandexMaps from "@/utils/yandexMaps";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import RouteItem from "@/components/shared/RouteItem";

const Route = () => {
  const [sum, setSum] = useState<number>(0);
  const routeData = useTypedSelector((state) => state.route);
  const { data } = useGetActiveOrdersQuery();
  useEffect(() => {
    const sum = data.reduce((sum, order) => {
      return sum + order.price;
    }, 0);
    setSum(sum);
  }, [data]);

  const openRoute = async () => {
    try {
      const points = routeData.route.map((address) =>
        yandexMaps.getPoint(address)
      );

      yandexMaps.getRoute(points);
    } catch (error) {
      console.log(error);
    }
  };

  if (routeData.route?.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.ordersHeaderText}>Маршрут</Text>
        </View>
        <Text style={styles.noOrdersText}>
          Похоже, что у вас нет активных заказов на данный момент. Вы можете
          выбрать подходящий на вкладке "Заказы"
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.ordersHeaderText}>Маршрут</Text>
      </View>
      <FlatList
        data={routeData.route}
        renderItem={({ item, index }) => (
          <RouteItem address={item} index={index} isTypeShown={true} />
        )}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 120,
          width: "100%",
        }}
        keyExtractor={(item) => item.id.toString()}
        style={{
          paddingTop: 10,
          paddingHorizontal: 5,
          width: "100%",
        }}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {"Расстояние " +
            routeData.distance.toFixed(2) +
            " км | Доход " +
            sum.toFixed(0) +
            " ₽"}
        </Text>
        <MyButton
          buttonText="Открыть маршрут на карте"
          onPress={openRoute}
          color="purple"
        />
      </View>
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  ordersHeaderText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  header: {
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.white,
    padding: 10,
    borderTopLeftRadius: borderRadiuses.medium,
    borderTopRightRadius: borderRadiuses.medium,
  },
  footerText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  loadingTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    margin: 20,
    textAlign: "center",
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});
