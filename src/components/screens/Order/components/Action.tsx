import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { ForwardedRef, forwardRef, Ref, useState } from "react";
import {
  IAddress,
  IOrderAction,
  IOrderActionType,
} from "@/types/order.interface";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useCompleteActionMutation } from "@/services/orders/orders.service";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MyButton from "@/components/ui/Button/Button";
import CustomBottomSheetModal from "@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal";
import { fonts } from "@/constants/styles";
import { useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";

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

const actionSnippets = {
  [IOrderActionType.GO_TO]: "Выезжаю на адрес", // Иконка для GO_TO
  [IOrderActionType.ARRIVED_AT]: "Прибыл на адрес", // Иконка для ARRIVED_AT
  [IOrderActionType.PICKUP]: "Забрал посылку", // Иконка для PICKUP
  [IOrderActionType.DELIVER]: "Доставил посылку ", // Иконка для DELIVER
  [IOrderActionType.COLLECT_PAYMENT]: "Получил оплату", // Иконка для COLLECT_PAYMENT
  [IOrderActionType.PAY_COMMISION]: "Оплатил комиссию", // Иконка для PAY_COMMISION
  [IOrderActionType.COMPLETE_ORDER]: "Завершил заказ", // Иконка для COMPLETE_ORDER
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

interface IProps {
  action: IOrderAction;
  address: IAddress;
  ref: Ref<BottomSheetModal>;
}

export const CompleteActionModal = forwardRef<BottomSheetModal, IProps>(
  (props, ref: ForwardedRef<BottomSheetModal>) => {
    const { action, address } = props;
    const location = useTypedSelector((state) => state.location);
    const snippet = actionSnippets[action.actionType];
    const [completeAction, { isLoading, isError }] =
      useCompleteActionMutation();
    const [error, setError] = useState<string>();

    const completeActionHandler = async () => {
      if (action.actionType == IOrderActionType.ARRIVED_AT) {
        try {
          const distance = geodataService.calculateDistanceToAddress(
            location,
            address
          );

          if (distance > 1) {
            setError(
              "Кажется, вы немного отошли от указанного адреса. Пожалуйста, проверьте ваше местоположение и убедитесь, что вы на правильном адресе."
            );
            return;
          }
        } catch (error) {
          console.log("error", JSON.stringify(error));
        }
      }
      try {
        await completeAction(action.id).unwrap();
        if (ref && "current" in ref && ref.current) {
          ref.current.close(); // Закрываем модальное окно, если ref доступен
        }
      } catch (error) {
        console.log(error);
        setError(error.data.message);
      }
    };

    return (
      <CustomBottomSheetModal ref={ref}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTextGroup}>
            <Text style={styles.modalTitle}>Подтвердите действие</Text>
            <Text style={styles.modalSubtitle}>Убедитесь, что сделали это</Text>
            <Text style={styles.modalSubtitle}>{action.description}</Text>
          </View>
          {action.actionType == IOrderActionType.PAY_COMMISION && (
            <Text style={styles.modalSubtitle}>
              Для оплаты комиссии с вами свяжется диспетчер. Если с вами не
              связались - напишите в техподдержку в Telegram.
            </Text>
          )}
          <Text style={styles.errorText}>{error}</Text>
          <MyButton onPress={completeActionHandler} buttonText={snippet} />
        </View>
      </CustomBottomSheetModal>
    );
  }
);

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
