import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import formatDate from "@/helpers/formatDate";
import MyButton from "@/components/ui/Button/Button";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import Address from "./components/Address";
import Header from "@/components/ui/Header/Header";
import Action from "./components/Action";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TakeOrderModal from "./components/TakeOrderModal";
import { fonts } from "@/constants/styles";

interface IProps {
  order: IOrderWithoutSensitiveInfo | IOrder;
}

const Order: FC<IProps> = ({ order }) => {
  const [currentPage, setCurrentPage] = useState<"addresses" | "actions">(
    "addresses"
  );

  const [takeOrder, { error }] = useTakeOrderMutation();

  const showModal = () => {
    ref.current.present();
  };

  const ref = useRef<BottomSheetModal>(null);

  const takeOrderHandler = async () => {
    await takeOrder({ orderId: order.id }).unwrap();
    ref.current.close();
  };

  return (
    <View style={styles.container}>
      <TakeOrderModal
        ref={ref}
        order={order}
        error={error?.message}
        takeOrder={takeOrderHandler}
      />

      <Header title={"Заказ № " + order.id} />
      <View style={styles.togglerTypeContainer}>
        <View style={styles.togglerType}>
          <TouchableOpacity
            onPress={() => setCurrentPage("addresses")}
            style={[
              styles.togglerOption,
              currentPage === "addresses" && styles.activeTogglerOption,
            ]}
          >
            <Text
              style={[
                styles.togglerText,
                currentPage === "addresses" && styles.activeTogglerText,
              ]}
            >
              Адреса
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentPage("actions")}
            style={[
              styles.togglerOption,
              currentPage === "actions" && styles.activeTogglerOption,
            ]}
          >
            <Text
              style={[
                styles.togglerText,
                currentPage === "actions" && styles.activeTogglerText,
              ]}
            >
              Действия
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {currentPage === "addresses" && (
        <View>
          <View style={styles.addresses}>
            <FlatList
              data={order.addresses}
              renderItem={({ item, index }) => (
                <Address address={item} index={index} price={order.price} />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                gap: 20,
                paddingBottom: 200,
                paddingTop: 10,
              }}
              ListFooterComponent={
                <View style={styles.listFooter}>
                  <View>
                    <Text style={styles.creationDateText}>
                      {"Создан " + formatDate(order.date)}
                    </Text>
                  </View>
                  {order.statusId == 5 && (
                    <Text style={styles.orderCompleted}>
                      Заказ завершен, спасибо!
                    </Text>
                  )}
                  {/* {order.statusId == 4 && (
                    <MyButton
                      buttonText="Отменить заказ"
                      onPress={() => {}}
                      color="red"
                    />
                  )} */}
                </View>
              }
            />
          </View>
        </View>
      )}
      {currentPage === "actions" && (
        <FlatList
          data={order.actions}
          renderItem={({ item }) => (
            <Action action={item} disabled={order.statusId != 4} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            gap: 10,
            paddingTop: 10,
            paddingBottom: 120,
          }}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerInfo}>
          {order.price + "₽ · " + order.weight + " · " + order.parcelType}
        </Text>
        {order.statusId == 3 && (
          <MyButton buttonText="Взять заказ" onPress={showModal} />
        )}
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 0,
  },
  togglerTypeContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  togglerType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
  },
  togglerText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  togglerOption: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  activeTogglerOption: {
    backgroundColor: colors.purple,
  },
  activeTogglerText: {
    color: colors.white,
  },

  addresses: {
    paddingHorizontal: 10,
    width: "100%",
    gap: 20,
  },
  listFooter: {
    gap: 20,
  },
  creationDateText: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: "center",
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
  orderCompleted: {
    fontSize: 24,
    color: colors.black,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginTop: 30,
  },
});
