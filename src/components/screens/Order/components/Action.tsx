import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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

  const [error, setError] = useState<string>();
  const icon = actionIcons[action.actionType]; // Получаем иконку из объекта
  const [completeAction, { isLoading, isError }] = useCompleteActionMutation();

  const ref = useRef<BottomSheetModal>(null);

  const handleCompleteAction = async () => {
    ref.current.present();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} />
    ),
    []
  );

  const completeActionHandler = async () => {
    try {
      await completeAction(action.id).unwrap();
      ref.current.collapse();
    } catch (error) {
      setError(error.data.message);
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
      <BottomSheetModal
        style={styles.bottomSheet}
        ref={ref}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.modalTitle}>Подтвердите действие</Text>
          <Text style={styles.modalSubtitle}>
            Убедитесь, что вы выбрали выполнили это действие
          </Text>
          <Text style={styles.errorText}>{isError && error}</Text>

          <MyButton
            onPress={completeActionHandler}
            buttonText={action.description}
          />
        </BottomSheetView>
      </BottomSheetModal>
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
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomSheetContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 20,
  },
  modalSubtitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: colors.red,
    textAlign: "center",
  },
});
