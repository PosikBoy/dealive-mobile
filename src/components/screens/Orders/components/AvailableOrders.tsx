import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGetAvailableOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/ui/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import geodataService from "@/services/geodata/geodata.service";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { fonts } from "@/constants/styles";
const AvailableOrders = () => {
  const [orders, setOrders] = useState<IOrderWithoutSensitiveInfo[]>([]);
  const location = useTypedSelector((state) => state.location);
  const { data, isLoading, refetch, isFetching } = useGetAvailableOrdersQuery(
    undefined,
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (!location.isLocationLoading && data) {
      const enrichedOrders = geodataService.enrichOrders(data, location);
      setOrders(enrichedOrders);
    }
  }, [data, location]);

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <ActivityIndicator size={"large"} color={colors.purple} />
          <Text style={styles.text}>
            Ищем заказы или пытаемся определить ваше местоположение
          </Text>
          <Text style={styles.text}>Подождите, пожалуйста</Text>
        </View>
      </View>
    );
  }
  if (orders.length === 0) {
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
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderPreview order={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListStyles}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={styles.update} onPress={() => refetch()}>
        {isFetching ? (
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

export default AvailableOrders;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 5,
    position: "relative",
  },
  text: {
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.medium,
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
