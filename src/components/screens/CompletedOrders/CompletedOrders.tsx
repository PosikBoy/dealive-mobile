import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { orderStatuses } from "@/constants/orderStatuses";
import Header from "@/components/shared/Header/Header";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";
import { IOrder } from "@/types/order.interface";
import { colors } from "@/constants/colors";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { FlashList } from "@shopify/flash-list";

const CompletedOrders = () => {
  const colorScheme = useColorScheme() || "light";
  const [orders, setOrders] = useState<IOrder[]>([]);

  const { data, isLoading } = useGetAllOrdersQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const location = useTypedSelector((state) => state.location);

  useEffect(() => {
    if (!location.isLocationLoading && data) {
      const enrichedOrders = geodataService.enrichOrders(data, location);

      setOrders(enrichedOrders);
    }
  }, [data, location]);

  if (location.error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View
            style={[
              styles.loadingModal,
              { backgroundColor: colors[colorScheme].white },
            ]}
          >
            <ThemedText type="big" weight="medium">
              {location.error}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Завершенные заказы" />
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View
            style={[
              styles.loadingModal,
              { backgroundColor: colors[colorScheme].white },
            ]}
          >
            <ActivityIndicator size={"large"} color={colors.purple} />
            <ThemedText type="big" weight="bold">
              {location.isLocationLoading
                ? "Пытаемся определить ваше местоположение"
                : "Запрашиваем заказы с сервера"}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  const completedOrders = data.filter(
    (order) => order.statusId == orderStatuses.delivered
  );

  return (
    <View style={styles.container}>
      <Header title="Завершенные заказы" />
      <View style={styles.ordersContainer}>
        {completedOrders.length > 0 && (
          <FlashList
            data={orders}
            estimatedItemSize={150}
            renderItem={({ item }) => <OrderPreview order={item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.flatListStyles}
            showsVerticalScrollIndicator={false}
          />
        )}
        {completedOrders.length === 0 && (
          <View style={styles.searchOrderContainer}>
            <Image
              source={icons.noOrders}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    position: "relative",
    backgroundColor: colors.backgroundColor,
  },
  flatListStyles: {
    paddingTop: 16,
    paddingBottom: 126,
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  searchOrderContainer: {
    marginHorizontal: "auto",
    marginTop: 100,
    height: 256,
    width: 256,
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
  separator: {
    height: 5, // Отступ между элементами
    backgroundColor: "transparent",
  },
});
