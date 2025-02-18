import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";

import { borderRadiuses, fonts, fontSizes } from "@/constants/styles";
import useRoute from "@/hooks/route.hook";
import MyButton from "@/components/ui/Button/Button";
import yandexMaps from "@/utils/yandexMaps";
import Address from "../Order/components/Address";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";

const Route = () => {
  const { route, isLoading, distance, sum, reroute } = useRoute();

  const openRoute = async () => {
    try {
      const points = route.map((address) => yandexMaps.getPoint(address));

      yandexMaps.getRoute(points);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("route", route, isLoading);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <OrderPreviewSkeleton />
        <OrderPreviewSkeleton />
        <OrderPreviewSkeleton />
        <View style={styles.loadingTextContainer}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size={"large"} color={colors.purple} />
          </View>
        </View>
      </View>
    );
  }

  if (route?.length === 0 || route === null) {
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
        data={route}
        renderItem={(address) => (
          <Address
            address={address.item}
            index={address.item.orderId}
            isTypeShown={true}
          />
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
            distance.toFixed(2) +
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
});
