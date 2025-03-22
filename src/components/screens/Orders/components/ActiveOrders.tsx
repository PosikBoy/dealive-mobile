import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import AvailableOrders from "./AvailableOrders";
import { useGetActiveOrdersQuery } from "@/services/orders/orders.service";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import Animated, { LinearTransition } from "react-native-reanimated";

const ActiveOrders = () => {
  const colorScheme = useColorScheme() || "light";
  const location = useTypedSelector((state) => state.location);
  const { data, isLoading, refetch } = useGetActiveOrdersQuery();
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
            <ThemedText type="big" weight="medium">
              {location.isLocationLoading
                ? "Пытаемся определить ваше местоположение"
                : "Запрашиваем заказы с сервера"}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noOrdersTextContainer}>
          <ThemedText weight="medium">
            Похоже, что у вас нет активных заказов на данный момент. Вы можете
            выбрать подходящий из списка ниже!
          </ThemedText>
        </View>
        <AvailableOrders />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={data}
          renderItem={({ item }) => <OrderPreview order={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatListStyles}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity
        style={[styles.update, { backgroundColor: colors[colorScheme].white }]}
        onPress={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Image
            tintColor={colors[colorScheme].black}
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
  noOrdersTextContainer: {
    margin: 20,
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
    height: 5,
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
    justifyContent: "center",
    alignItems: "center",
  },
});
