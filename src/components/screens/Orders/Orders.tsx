import Header from "@/components/shared/Header/Header";
import Toggler from "@/components/ui/HorizontalToggler/HorizontalToggler";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ActiveOrders from "./components/ActiveOrders";
import AvailableOrders from "./components/AvailableOrders";
import RecommendedOrders from "./components/RecommendedOrders";

const options = ["Доступные", "Лучшие", "Активные"];

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<string>("Доступные");

  const tabAnimation = useRef(
    new Animated.Value(options.indexOf(activeTab))
  ).current;

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: options.indexOf(activeTab),
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [activeTab, tabAnimation]);

  const availableTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -20, -20],
      }),
    [tabAnimation]
  );

  const recommendedTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [20, 0, -20],
      }),
    [tabAnimation]
  );

  const activeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [20, -20, 0],
      }),
    [tabAnimation]
  );

  const availableOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 0, 0],
      }),
    [tabAnimation]
  );

  const recommendedOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
      }),
    [tabAnimation]
  );

  const activeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 1],
      }),
    [tabAnimation]
  );

  return (
    <View style={styles.container}>
      <Header title="Заказы" isButtonBackShown={false} />
      <Toggler
        options={options}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <View style={styles.ordersContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === "Доступные" ? "auto" : "none",
            },
          ]}
        >
          <AvailableOrders />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: recommendedOpacity,
              transform: [{ translateX: recommendedTranslate }],
              pointerEvents: activeTab === "Лучшие" ? "auto" : "none",
            },
          ]}
        >
          <RecommendedOrders />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: activeOpacity,
              transform: [{ translateX: activeTranslate }],
              pointerEvents: activeTab === "Активные" ? "auto" : "none",
            },
          ]}
        >
          <ActiveOrders />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  ordersContainer: {
    flex: 1,
  },
  tabContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
});

export default OrdersScreen;
