import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import { borderRadiuses, fonts, fontSizes } from "@/constants/styles";
import MyButton from "@/components/ui/Button/Button";
import yandexMaps from "@/utils/yandexMaps";
import Address from "../Order/components/Address";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";

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
          <View style={styles.addressContainer}>
            <View style={styles.addressIndexContainer}>
              <Text style={styles.addressIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.address}>
              <Address
                address={item}
                index={item.orderId - 1}
                isTypeShown={true}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 120,
          width: "100%",
        }}
        keyExtractor={(item) => item.id.toString()}
        style={{
          backgroundColor: colors.backgroundColor,
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
      {/* <MyButton
        buttonText="Пересчитать маршрут"
        onPress={reroute}
        color="red"
      /> */}
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
});
