import Header from "@/components/shared/Header/Header";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import { IAddress, IOrder, IOrderActionType } from "@/types/order.interface";
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
  Linking,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import Actions from "./components/Actions";
import Addresses from "./components/Addresses";

import { ApiError } from "@/axios/api-error";
import Toggler from "@/components/ui/HorizontalToggler/HorizontalToggler";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { icons } from "@/constants/icons";
import { orderStatuses } from "@/constants/orderStatuses";
import { useTypedSelector } from "@/hooks/redux.hooks";
import routeService from "@/services/route/route.service";
import yandexMaps from "@/utils/yandexMaps";
import Route from "./components/Route";

interface IProps {
  order: IOrder;
}
const options = ["Адреса", "Действия", "Маршрут"];

const ACTION_SNIPPETS = {
  [IOrderActionType.GO_TO]: "✅ Выезжаю на адрес",
  [IOrderActionType.ARRIVED_AT]: "📍 Я на месте",
  [IOrderActionType.PICKUP]: "📦 Посылка получена",
  [IOrderActionType.DELIVER]: "🏁 Доставлено",
  [IOrderActionType.COLLECT_PAYMENT]: "💵 Получена оплата",
  [IOrderActionType.PAY_COMMISION]: "📝 Оплатить комиссию",
  [IOrderActionType.COMPLETE_ORDER]: "🎉 Завершить заказ",
};

interface IRouteState {
  distance: number;
  route: IAddress[];
}

const Order: FC<IProps> = ({ order }) => {
  const colorScheme = useColorScheme();

  const [activeTab, setActiveTab] = useState<string>("Адреса");
  const [route, setRoute] = useState<IRouteState>({ distance: 0, route: [] });
  const [takeOrder, { error }] = useTakeOrderMutation();
  const routeState = useTypedSelector((state) => state.route);

  const showTakeOrderButton = order.statusId === orderStatuses.searchCourier;
  const showCompleteActionButton = order.statusId === orderStatuses.inProcess;

  useEffect(() => {
    if (order.statusId === orderStatuses.inProcess) {
      setRoute(routeState);
    }

    if (order.statusId === orderStatuses.searchCourier) {
      const route = routeService.getRouteWithNewOrder(routeState.route, order);
      setRoute(route);
    }
  }, []);

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
    try {
      await takeOrder({ orderId: order.id }).unwrap();
      SheetManager.hide("take-order-sheet");
    } catch (err) {
      const apiError = err as ApiError;
      ToastAndroid.show(apiError.message, ToastAndroid.SHORT);
    }
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

  const activeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [20, 0, -20],
      }),
    [tabAnimation]
  );

  const routeTranslate = useMemo(
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

  const activeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
      }),
    [tabAnimation]
  );

  const routeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 1],
      }),
    [tabAnimation]
  );

  if (error) {
    console.error(error);

    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={"Заказ № " + order.id} />
      <Toggler
        options={options}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <View style={styles.orderContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === "Адреса" ? "auto" : "none",
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
              pointerEvents: activeTab === "Действия" ? "auto" : "none",
            },
          ]}
        >
          <Actions order={order} />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: routeOpacity,
              transform: [{ translateX: routeTranslate }],
              pointerEvents: activeTab === "Маршрут" ? "auto" : "none",
            },
          ]}
        >
          <Route route={route.route} orderId={order.id} />
        </Animated.View>
      </View>
      <View
        style={[styles.footer, { backgroundColor: colors[colorScheme].white }]}
      >
        <ThemedText style={styles.footerInfo}>
          {order.price + "₽ · " + order.weight + " · " + order.parcelType}
        </ThemedText>
        <View style={styles.buttonsContainer}>
          {showTakeOrderButton && (
            <MyButton buttonText="Взять заказ" onPress={takeOrderModalShow} />
          )}
          {showCompleteActionButton && (
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
    backgroundColor: colors.backgroundColor,
  },

  orderContainer: {
    flex: 1,
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
