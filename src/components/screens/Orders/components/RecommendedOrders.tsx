import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { colors } from "@/constants/colors";
import useRecommendedOrders from "@/hooks/recommendation.hook";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import AvailableOrders from "./AvailableOrders";

const RecommendedOrders = () => {
  const colorScheme = useColorScheme() || "light";
  const location = useTypedSelector((state) => state.location);
  const { recommendedOrders, isLoading } = useRecommendedOrders();

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

  if (recommendedOrders.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText weight="medium" type="mediumText">
          Похоже, что сейчас мы не можем порекомендовать вам заказы
        </ThemedText>
        <AvailableOrders />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={recommendedOrders}
        estimatedItemSize={150} // 🔥 ВАЖНО: FlashList требует указанного размера элемента
        keyExtractor={(item) => item.order.id.toString()}
        renderItem={({ item }) => (
          <OrderPreview order={item.order} incomePerHour={item.incomePerHour} />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.flatListStyles}
      />
    </View>
  );
};

export default RecommendedOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 5,
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
  loadingModal: {
    transform: [{ translateY: -60 }],
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 5,
    backgroundColor: "transparent",
  },
});
