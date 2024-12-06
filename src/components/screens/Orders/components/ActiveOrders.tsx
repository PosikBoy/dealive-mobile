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
import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/ui/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
const AvailableOrders = () => {
  const { data, isLoading, refetch, isFetching } = useGetActiveOrdersQuery(
    undefined,
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <Image
            source={icons.refetch}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
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
            resizeMode="cover"
          />
        </View>
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
