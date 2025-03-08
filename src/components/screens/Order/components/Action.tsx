import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  IAddress,
  IOrderAction,
  IOrderActionType,
} from "@/types/order.interface";

import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { fonts } from "@/constants/styles";

type Props = {
  action: IOrderAction;
  disabled: boolean;
  address: IAddress;
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

export const Action = (props: Props) => {
  const { action, disabled } = props;
  const icon = actionIcons[action.actionType];

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        style={[styles.action, action.isCompleted && styles.actionCompleted]}
      >
        <View style={styles.iconContainer}>
          <Image source={icon} style={{ width: 20, height: 20 }} />
        </View>
        <Text style={styles.actionText}>{action.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    fontFamily: fonts.medium,
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
