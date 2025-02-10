import { IOrder } from "@/types/order.interface";
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
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import MyButton from "@/components/ui/Button/Button";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import Header from "@/components/shared/Header/Header";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TakeOrderModal from "./components/TakeOrderModal";
import { fonts, fontSizes } from "@/constants/styles";
import { Action, CompleteActionModal } from "./components/Action";
import Addresses from "./components/Addresses";
import Actions from "./components/Actions";

interface IProps {
  order: IOrder;
}

const Order: FC<IProps> = ({ order }) => {
  const [activeTab, setActiveTab] = useState<"addresses" | "actions">(
    "addresses"
  );

  const [takeOrder, { error }] = useTakeOrderMutation();

  const TakeOrderModalRef = useRef<BottomSheetModal>(null);

  const takeOrderModalShow = () => {
    TakeOrderModalRef.current.present();
  };

  const takeOrderHandler = async () => {
    await takeOrder({ orderId: order.id }).unwrap();
    TakeOrderModalRef.current.close();
  };

  const CompleteActionModalRef = useRef<BottomSheetModal>(null);

  const completeActionModalShow = () => {
    CompleteActionModalRef.current.present();
  };

  const lastAction = order.actions.find((action) => !action.isCompleted);

  const lastAddress = order.addresses.find(
    (address) => address.id == lastAction?.addressId
  );

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
      <TakeOrderModal
        ref={TakeOrderModalRef}
        order={order}
        error={error?.message}
        takeOrder={takeOrderHandler}
      />

      <CompleteActionModal
        ref={CompleteActionModalRef}
        action={lastAction}
        address={lastAddress}
      />

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
          <Addresses order={order} />
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
        {order.statusId == 3 && (
          <MyButton buttonText="Взять заказ" onPress={takeOrderModalShow} />
        )}
        {order.statusId == 4 && (
          <MyButton
            buttonText={lastAction.description}
            onPress={completeActionModalShow}
          />
        )}
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
    width: "50%", // Индикатор занимает половину ширины контейнера
    backgroundColor: colors.purple,
    zIndex: -1, // Помещаем индикатор под текст
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
});
