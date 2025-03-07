import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  IAddress,
  IOrderAction,
  IOrderActionType,
} from "@/types/order.interface";
import { colors } from "@/constants/colors";
import { useCompleteActionMutation } from "@/services/orders/orders.service";
import MyButton from "@/components/ui/Button/Button";

import { fonts } from "@/constants/styles";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import geodataService from "@/services/geodata/geodata.service";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { removeAddressFromRoute } from "@/store/route/route.slice";

const ACTION_SNIPPETS = {
  [IOrderActionType.GO_TO]: "✅ Выезжаю на адрес",
  [IOrderActionType.ARRIVED_AT]: "📍 Я на месте",
  [IOrderActionType.PICKUP]: "📦 Посылка получена",
  [IOrderActionType.DELIVER]: "🏁 Доставлено",
  [IOrderActionType.COLLECT_PAYMENT]: "💵 Получена оплата",
  [IOrderActionType.PAY_COMMISION]: "📝 Оплатить комиссию",
  [IOrderActionType.COMPLETE_ORDER]: "🎉 Завершить заказ",
};

const LOCATION_DISTANCE_THRESHOLD = 1; // km

const PAY_COMMISION_MESSAGE = `После подтверждения:
1. Диспетчер свяжется с вами в течение 5 минут
2. Проведите оплату по полученным реквизитам
3. Сохраните чек 

Нет связи? Напишите в поддержку Telegram.`;

const ERROR_MESSAGES = {
  location: `Система не может подтвердить ваше местоположение

Что делать:
1. Проверьте включен ли GPS
2. Подойдите ближе к точке назначения
3. Обновите страницу

Ошибка остается? Свяжитесь с поддержкой Telegram.`,
  default: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
};

export interface ICompleteActionSheet {
  action: IOrderAction;
  address: IAddress;
}

export const CompleteActionSheet = React.memo(
  (props: SheetProps<"complete-action-sheet">) => {
    const { action, address } = props.payload;
    const location = useTypedSelector((state) => state.location);
    const snippet = ACTION_SNIPPETS[action.actionType];
    const [completeAction, { isLoading }] = useCompleteActionMutation();
    const [error, setError] = useState<string>();
    const dispatch = useTypedDispatch();

    const validateLocation = useCallback(async () => {
      try {
        const distance = geodataService.calculateDistanceToAddress(
          location,
          address
        );
        return distance <= LOCATION_DISTANCE_THRESHOLD;
      } catch (error) {
        console.error("Location validation error:", error);
        return false;
      }
    }, [location, address]);

    const handleCompleteAction = useCallback(async () => {
      try {
        if (action.actionType === IOrderActionType.ARRIVED_AT) {
          const isValidLocation = await validateLocation();
          if (!isValidLocation) {
            setError(ERROR_MESSAGES.location);
            return;
          }
        }

        await completeAction(action.id).unwrap();
        if (action.actionType == IOrderActionType.ARRIVED_AT) {
          dispatch(removeAddressFromRoute(address.id));
        }

        SheetManager.hide("complete-action-sheet");
        ToastAndroid.show(
          "Действие подтверждено, спасибо!",
          ToastAndroid.SHORT
        );
      } catch (error) {
        setError(error.data?.message || ERROR_MESSAGES.default);
      }
    }, [action.id, action.actionType, validateLocation, completeAction]);

    const renderAdditionalInfo = () => {
      if (action.actionType === IOrderActionType.PAY_COMMISION) {
        return <Text style={styles.sheetText}>{PAY_COMMISION_MESSAGE}</Text>;
      }
      return null;
    };
    return (
      <ActionSheet gestureEnabled={true} id={"complete-action-sheet"}>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetTextGroup}>
            <Text style={styles.sheetTitle}>Подтверждение выполнения</Text>
            <Text style={styles.sheetText}>Пожалуйста, проверьте:</Text>
            <Text style={styles.sheetText}>{action.description}</Text>
          </View>
          {renderAdditionalInfo()}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <MyButton
            onPress={handleCompleteAction}
            buttonText={snippet}
            disabled={isLoading}
          />
        </View>
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
  },
  sheetTextGroup: {
    width: "100%",
    gap: 5,
    alignItems: "center",
  },
  sheetTitle: {
    fontFamily: fonts.medium,
    fontSize: 20,
  },
  sheetText: {
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
