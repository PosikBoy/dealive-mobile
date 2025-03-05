import { FlatList, Image, StyleSheet, View } from "react-native";
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

const CompletedOrders = () => {
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <Image
            source={icons.searchOrders}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
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
          <FlatList
            data={orders}
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
    paddingHorizontal: 5,
  },
  searchOrderContainer: {
    marginHorizontal: "auto",
    marginTop: 100,
    height: 256,
    width: 256,
  },
  separator: {
    height: 20, // Отступ между элементами
    backgroundColor: "transparent",
  },
});
