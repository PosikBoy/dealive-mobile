import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { colors } from "@/constants/colors";
import AvailableOrders from "./components/AvailableOrders";
import ActiveOrders from "./components/ActiveOrders";
import { fonts, fontSizes } from "@/constants/styles";

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState<"available" | "active">(
    "available"
  );
  const tabAnimation = useRef(
    new Animated.Value(activeTab === "available" ? 0 : 1)
  ).current;
  const [togglerWidth, setTogglerWidth] = useState(0);

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: activeTab === "available" ? 0 : 1,
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [activeTab, tabAnimation]);

  const availableTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
      }),
    [tabAnimation]
  );

  const activeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    [tabAnimation]
  );

  const availableOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [tabAnimation]
  );

  const activeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    [tabAnimation]
  );

  const indicatorTranslateX = useMemo(() => {
    return tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, togglerWidth / 2],
    });
  }, [tabAnimation, togglerWidth]);

  const handleAvailablePress = useCallback(() => setActiveTab("available"), []);
  const handleActivePress = useCallback(() => setActiveTab("active"), []);

  // Получение ширины контейнера тогглера
  const onTogglerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTogglerWidth(width);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersHeaderText}>Заказы</Text>
        <View style={styles.togglerType} onLayout={onTogglerLayout}>
          {/* Анимированный индикатор */}
          <Animated.View
            style={[
              styles.indicator,
              { transform: [{ translateX: indicatorTranslateX }] },
            ]}
          />
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Показать доступные заказы"
            onPress={handleAvailablePress}
            style={[styles.togglerOption]}
          >
            <Text
              style={[
                styles.togglerText,
                activeTab === "available" && styles.activeTogglerText,
              ]}
            >
              Доступные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Показать активные заказы"
            onPress={handleActivePress}
            style={[styles.togglerOption]}
          >
            <Text
              style={[
                styles.togglerText,
                activeTab === "active" && styles.activeTogglerText,
              ]}
            >
              Активные
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ordersContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === "available" ? "auto" : "none",
            },
          ]}
        >
          <AvailableOrders />
        </Animated.View>

        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: activeOpacity,
              transform: [{ translateX: activeTranslate }],
              pointerEvents: activeTab === "active" ? "auto" : "none",
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
  },
  ordersHeader: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    gap: 10,
  },
  ordersHeaderText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  togglerType: {
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "50%", // Индикатор занимает половину ширины контейнера
    backgroundColor: colors.purple,
    zIndex: -1, // Помещаем индикатор под текст
  },
  togglerOption: {
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  togglerText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  activeTogglerText: {
    color: colors.white,
  },
  ordersContainer: {
    flex: 1,
    // position: "relative",
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
