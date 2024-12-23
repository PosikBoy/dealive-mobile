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
import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/ui/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { fonts } from "@/constants/styles";
const AvailableOrders = () => {
  const [orders, setOrders] = useState<IOrderWithoutSensitiveInfo[] | IOrder[]>(
    []
  );

  const { data, isLoading, refetch, isFetching } = useGetActiveOrdersQuery(
    undefined,
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const location = useTypedSelector((state) => state.location);

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
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <Image
            source={icons.noOrders}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatListStyles}
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
  text: {
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.medium,
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
