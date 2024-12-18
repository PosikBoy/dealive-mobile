import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { IOrderAction, IOrderActionType } from "@/types/order.interface";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useCompleteActionMutation } from "@/services/orders/orders.service";

type Props = {
  action: IOrderAction;
};

const actionIcons = {
  [IOrderActionType.GO_TO]: icons.goTo, // Иконка для GO_TO
  [IOrderActionType.ARRIVED_AT]: icons.mapDot, // Иконка для ARRIVED_AT
  [IOrderActionType.PICKUP]: icons.parcel, // Иконка для PICKUP
  [IOrderActionType.DELIVER]: icons.parcel, // Иконка для DELIVER
  [IOrderActionType.COLLECT_PAYMENT]: icons.money, // Иконка для COLLECT_PAYMENT
  [IOrderActionType.PAY_COMMISION]: icons.money, // Иконка для PAY_COMMISION
  [IOrderActionType.COMPLETE_ORDER]: icons.check, // Иконка для COMPLETE_ORDER
};

const Action = (props: Props) => {
  const { action } = props;
  const icon = actionIcons[action.actionType]; // Получаем иконку из объекта
  const [completeAction, { isLoading, isError }] = useCompleteActionMutation();

  const handleCompleteAction = async () => {
    try {
      await completeAction(action.id).unwrap(); // unwrap для обработки результата
      console.log("Action completed successfully");
    } catch (error) {
      console.error("Failed to complete action:", error);
    }
  };
  return (
    <View style={styles.actionContainer}>
      <Pressable
        onPress={handleCompleteAction}
        style={[styles.action, action.isCompleted && styles.actionCompleted]}
      >
        <View style={styles.iconContainer}>
          <Image source={icon} style={{ width: 20, height: 20 }} />
        </View>
        <Text style={styles.actionText}>{action.description}</Text>
      </Pressable>
    </View>
  );
};

export default Action;

const styles = StyleSheet.create({
  actionContainer: {
    paddingHorizontal: 10,
  },
  action: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    color: colors.black,
  },
  actionCompleted: {
    backgroundColor: colors.green,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
  },
});
