import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useGetActiveOrders } from "@/services/orders/orders.service";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { fonts } from "@/constants/styles";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import AvailableOrders from "./AvailableOrders";

const ActiveOrders = () => {
  const location = useTypedSelector((state) => state.location);
  const { data, isLoading, refetch } = useGetActiveOrders();

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size={"large"} color={colors.purple} />
            <Text style={styles.text}>
              {location.isLocationLoading
                ? "Пытаемся определить ваше местоположение"
                : "Запрашиваем заказы с сервера"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noOrdersText}>
          Похоже, что у вас нет активных заказов на данный момент. Вы можете
          выбрать подходящий из списка ниже!
        </Text>
        <AvailableOrders />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => <OrderPreview order={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatListStyles}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        style={styles.update}
        onPress={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Image
            source={icons.refetch}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ActiveOrders;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 5,
    position: "relative",
  },
  flatListStyles: {
    paddingTop: 16,
    paddingBottom: 126,
  },
  loadingContainer: {
    marginTop: 16,
    gap: 20,
  },
  loadingTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
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
  loadingModal: {
    transform: [{ translateY: -60 }],
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.medium,
  },
  separator: {
    height: 20,
    backgroundColor: "transparent",
  },
  update: {
    position: "absolute",
    bottom: 130,
    right: 20,
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
