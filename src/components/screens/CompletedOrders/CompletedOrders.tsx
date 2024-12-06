import { FlatList, Image, StyleSheet, View } from "react-native";
import React from "react";
import { useGetAllOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/ui/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { orderStatuses } from "@/constants/orderStatuses";
import Header from "@/components/ui/Header/Header";
import { icons } from "@/constants/icons";
const CompletedOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

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
      <View>
        {completedOrders.length > 0 && (
          <FlatList
            data={completedOrders}
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
  },
  flatListStyles: {
    paddingTop: 16,
    paddingBottom: 126,
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
