import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { useTypedSelector } from "@/hooks/redux.hooks";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import AvailableOrders from "./AvailableOrders";
import useRecommendedOrders from "@/hooks/recommendation.hook";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import Animated, { FadeInRight } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";

const RecommendedOrders = () => {
  const location = useTypedSelector((state) => state.location);
  const { recommendedOrders, isLoading } = useRecommendedOrders();

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
          <Animated.View entering={FadeInRight.duration(500)}>
            <OrderPreview
              order={item.order}
              incomePerHour={item.incomePerHour}
            />
          </Animated.View>
        )}
        showsVerticalScrollIndicator={true}
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
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
