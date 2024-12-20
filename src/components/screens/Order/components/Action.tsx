import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { IOrderAction, IOrderActionType } from "@/types/order.interface";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useCompleteActionMutation } from "@/services/orders/orders.service";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MyButton from "@/components/ui/Button/Button";
import CustomBottomSheetModal from "@/components/ui/CustomBottomSheetModal/CustomBottomSheetModal";
import { fonts } from "@/constants/styles";

type Props = {
  action: IOrderAction;
  disabled: boolean;
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

const actionSnippets = {
  [IOrderActionType.GO_TO]: "Выезжаю на адрес", // Иконка для GO_TO
  [IOrderActionType.ARRIVED_AT]: "Прибыл на адрес", // Иконка для ARRIVED_AT
  [IOrderActionType.PICKUP]: "Забрал посылку", // Иконка для PICKUP
  [IOrderActionType.DELIVER]: "Доставил посылку ", // Иконка для DELIVER
  [IOrderActionType.COLLECT_PAYMENT]: "Получил оплату", // Иконка для COLLECT_PAYMENT
  [IOrderActionType.PAY_COMMISION]: "Оплатил комиссию", // Иконка для PAY_COMMISION
  [IOrderActionType.COMPLETE_ORDER]: "Завершил заказ", // Иконка для COMPLETE_ORDER
};

const Action = (props: Props) => {
  const { action, disabled } = props;

  const [error, setError] = useState<string>();
  const icon = actionIcons[action.actionType];
  const snippet = actionSnippets[action.actionType];
  const [completeAction, { isLoading, isError }] = useCompleteActionMutation();

  const ref = useRef<BottomSheetModal>(null);

  const handleCompleteAction = async () => {
    ref.current.present();
  };

  const completeActionHandler = async () => {
    try {
      await completeAction(action.id).unwrap();
      ref.current.close();
    } catch (error) {
      setError(error.data.message);
    }
  };

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={handleCompleteAction}
        style={[styles.action, action.isCompleted && styles.actionCompleted]}
      >
        <View style={styles.iconContainer}>
          <Image source={icon} style={{ width: 20, height: 20 }} />
        </View>
        <Text style={styles.actionText}>{action.description}</Text>
      </TouchableOpacity>
      <CustomBottomSheetModal ref={ref}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTextGroup}>
            <Text style={styles.modalTitle}>Подтвердите действие</Text>
            <Text style={styles.modalSubtitle}>Убедитесь, что сделали это</Text>
            <Text style={styles.modalSubtitle}>{action.description}</Text>
          </View>
          <Text style={styles.errorText}>{isError && error}</Text>
          <MyButton onPress={completeActionHandler} buttonText={snippet} />
        </View>
      </CustomBottomSheetModal>
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

  modalContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  modalTextGroup: {
    width: "100%",
    gap: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: fonts.medium,
    fontSize: 20,
  },
  modalSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.red,
    textAlign: "center",
  },
});
