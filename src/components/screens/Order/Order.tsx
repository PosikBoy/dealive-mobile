import { IAddress, IOrder, IOrderActionType } from "@/types/order.interface";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";
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
import Toggler from "@/components/ui/HorizontalToggler/HorizontalToggler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Route from "./components/Route";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import routeService from "@/services/route/route.service";
import { pushRoute } from "@/store/route/route.slice";

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
const options = ["Адреса", "Действия", "Маршрут"];

interface IRouteState {
  distance: number;
  route: IAddress[];
}

const Order: FC<IProps> = ({ order }) => {
  const [activeTab, setActiveTab] = useState<string>("Адреса");
  const [route, setRoute] = useState<IRouteState>({ distance: 0, route: [] });
  const routeState = useTypedSelector((state) => state.route.route);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const route = routeService.getRouteWithNewOrder(routeState, order);
    setRoute(route);
  }, []);

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
    try {
      await takeOrder({ orderId: order.id }).unwrap();
      dispatch(pushRoute(route));
      SheetManager.hide("take-order-sheet");
    } catch (error) {
      console.log(error);
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

  const tabAnimation = useSharedValue(0);

  useEffect(() => {
    const index = options.indexOf(activeTab);
    tabAnimation.value = withTiming(index, { duration: 300 });
  }, [activeTab, tabAnimation]);

  const addressesTabStyle = useAnimatedStyle(() => {
    const addressesTranslate = interpolate(
      tabAnimation.value,
      [0, 1, 2],
      [0, -20, -20]
    );
    const addressesOpacity = interpolate(
      tabAnimation.value,
      [0, 1, 2],
      [1, 0, 0]
    );
    return {
      transform: [{ translateX: addressesTranslate }],
      opacity: addressesOpacity,
    };
  });

  const actionsTabStyle = useAnimatedStyle(() => {
    const actionsTranslate = interpolate(
      tabAnimation.value,
      [0, 1, 2],
      [20, 0, -20]
    );
    const actionsOpacity = interpolate(
      tabAnimation.value,
      [0, 1, 2],
      [0, 1, 0]
    );

    return {
      transform: [{ translateX: actionsTranslate }],
      opacity: actionsOpacity,
    };
  });

  const routeTabStyle = useAnimatedStyle(() => {
    const routeTranslate = interpolate(
      tabAnimation.value,
      [0, 1, 2],
      [-20, -20, 0]
    );

    const routeOpacity = interpolate(tabAnimation.value, [0, 1, 2], [0, 0, 1]);

    return {
      transform: [{ translateX: routeTranslate }],
      opacity: routeOpacity,
    };
  });

  return (
    <View style={styles.container}>
      <Header title={"Заказ № " + order.id} />
      <View style={styles.togglerTypeContainer}>
        <Toggler
          activeTab={activeTab}
          options={options}
          onChange={setActiveTab}
        />
      </View>
      <View style={styles.orderContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            addressesTabStyle,
            activeTab === "Адреса" ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Addresses order={order} activeAddressId={lastAction?.addressId} />
        </Animated.View>

        <Animated.View
          style={[
            styles.tabContent,
            actionsTabStyle,
            activeTab === "Действия" ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Actions order={order} />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            routeTabStyle,
            activeTab === "Маршрут" ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Route route={route.route} />
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

  togglerTypeContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
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
  activeTab: {
    pointerEvents: "auto",
  },
  inactiveTab: {
    pointerEvents: "none",
  },
});
