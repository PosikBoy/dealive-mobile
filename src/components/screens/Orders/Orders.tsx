import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { colors } from "@/constants/colors";
import AvailableOrders from "./components/AvailableOrders";
import ActiveOrders from "./components/ActiveOrders";
import Toggler from "@/components/ui/HorizontalToggler/HorizontalToggler";
import RecommendedOrders from "./components/RecommendedOrders";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const options = ["Доступные", "Рекомендация", "Активные"];

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
      <View style={styles.ordersHeader}>
        <ThemedText weight="bold" type="heading">
          Заказы
        </ThemedText>
        <Toggler
          options={options}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </View>

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
              pointerEvents: activeTab === "Рекомендация" ? "auto" : "none",
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
  ordersHeader: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
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
