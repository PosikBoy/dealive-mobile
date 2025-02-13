import { IOrder, IOrderActionType } from "@/types/order.interface";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import MyButton from "@/components/ui/Button/Button";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import Header from "@/components/shared/Header/Header";
import { fonts, fontSizes } from "@/constants/styles";
import Addresses from "./components/Addresses";
import Actions from "./components/Actions";
import { SheetManager } from "react-native-actions-sheet";

import { icons } from "@/constants/icons";
import yandexMaps from "@/utils/yandexMaps";

interface IProps {
  order: IOrder;
}

const ACTION_SNIPPETS = {
  [IOrderActionType.GO_TO]: "✅ Выезжаю на адрес",
  [IOrderActionType.ARRIVED_AT]: "📍 Я на месте",
  [IOrderActionType.PICKUP]: "📦 Посылка получена",
  [IOrderActionType.DELIVER]: "🏁 Доставлено",
  [IOrderActionType.COLLECT_PAYMENT]: "💵 Получена оплата",
  [IOrderActionType.PAY_COMMISION]: "📝 Оплатить комиссию",
  [IOrderActionType.COMPLETE_ORDER]: "🎉 Завершить заказ",
};

const Order: FC<IProps> = ({ order }) => {
  const [activeTab, setActiveTab] = useState<"addresses" | "actions">(
    "addresses"
  );

  const [takeOrder, { error }] = useTakeOrderMutation();

  const takeOrderModalShow = () => {
    SheetManager.show("take-order-sheet", {
      payload: {
        order: order,
        error: error?.message,
        takeOrder: takeOrderHandler,
      },
    });
  };

  const takeOrderHandler = async () => {
    await takeOrder({ orderId: order.id }).unwrap();
    SheetManager.hide("take-order-sheet");
  };

  const lastAction = order.actions.find((action) => !action.isCompleted);

  const lastAddress = order.addresses.find(
    (address) => address.id == lastAction?.addressId
  );

  const completeActionPayload = useMemo(
    () => ({
      address: lastAddress,
      action: lastAction,
    }),
    [lastAddress, lastAction]
  );

  const completeActionModalShow = useCallback(() => {
    SheetManager.show("complete-action-sheet", {
      payload: completeActionPayload,
    });
  }, [completeActionPayload]);

  const openMaps = async () => {
    try {
      yandexMaps.getRouteToPoint(
        lastAddress.geoData.geoLat,
        lastAddress.geoData.geoLon
      );
    } catch (err) {
      console.error("Ошибка при открытии URL:", err);
    }
  };

  const callPhone = () => {
    Linking.openURL(
      `tel:${"phoneNumber" in lastAddress ? lastAddress.phoneNumber : ""}`
    );
  };

  //Анимации
  const [togglerWidth, setTogglerWidth] = useState(0);

  const tabAnimation = useRef(
    new Animated.Value(activeTab === "addresses" ? 0 : 1)
  ).current;

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: activeTab === "addresses" ? 0 : 1,
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

  const handleAddressesPress = useCallback(() => setActiveTab("addresses"), []);
  const handleActionsPress = useCallback(() => setActiveTab("actions"), []);

  const onTogglerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTogglerWidth(width);
  };

  return (
    <View style={styles.container}>
      <Header title={"Заказ № " + order.id} />
      <View style={styles.togglerTypeContainer}>
        <View style={styles.togglerType} onLayout={onTogglerLayout}>
          <Animated.View
            style={[
              styles.indicator,
              { transform: [{ translateX: indicatorTranslateX }] },
            ]}
          />
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Показать адреса заказа"
            onPress={handleAddressesPress}
            style={[styles.togglerOption]}
          >
            <Text
              style={[
                styles.togglerText,
                activeTab === "addresses" && styles.activeTogglerText,
              ]}
            >
              Адреса
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Показать действия заказа"
            onPress={handleActionsPress}
            style={[styles.togglerOption]}
          >
            <Text
              style={[
                styles.togglerText,
                activeTab === "actions" && styles.activeTogglerText,
              ]}
            >
              Действия
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.orderContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === "addresses" ? "auto" : "none",
            },
          ]}
        >
          <Addresses order={order} activeAddressId={lastAction?.addressId} />
        </Animated.View>

        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: activeOpacity,
              transform: [{ translateX: activeTranslate }],
              pointerEvents: activeTab === "actions" ? "auto" : "none",
            },
          ]}
        >
          <Actions order={order} />
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerInfo}>
          {order.price + "₽ · " + order.weight + " · " + order.parcelType}
        </Text>
        <View style={styles.buttonsContainer}>
          {order.statusId == 3 && (
            <MyButton buttonText="Взять заказ" onPress={takeOrderModalShow} />
          )}
          {order.statusId == 4 && (
            <>
              <View style={{ flex: 1 }}>
                <MyButton
                  buttonText={ACTION_SNIPPETS[lastAction.actionType]}
                  onPress={completeActionModalShow}
                />
              </View>

              {lastAddress?.geoData && (
                <View style={{ width: "20%" }}>
                  <MyButton
                    icon={
                      <Image
                        style={{ width: "100%", height: 20 }}
                        source={icons.location}
                      />
                    }
                    color="lightPurple"
                    onPress={openMaps}
                  />
                </View>
              )}
              {lastAddress?.phoneNumber && (
                <View style={{ width: "20%" }}>
                  <MyButton
                    icon={
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={icons.phone}
                      />
                    }
                    color="lightPurple"
                    onPress={callPhone}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "50%",
    backgroundColor: colors.purple,
    zIndex: -1,
  },
  togglerTypeContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  togglerType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
  },
  togglerText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  togglerOption: {
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  activeTogglerText: {
    color: colors.white,
  },
  orderContainer: {
    flex: 1,
    position: "relative",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    gap: 10,
    boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.10)",
    backgroundColor: colors.white,
  },
  footerInfo: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  tabContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
