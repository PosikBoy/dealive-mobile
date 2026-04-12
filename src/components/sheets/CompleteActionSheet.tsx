import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { useCompleteActionMutation } from '@/domain/orders/api';
import { IAddress, IOrderAction, IOrderActionType } from '@/domain/orders/types';
import { calculateDistanceToAddress } from '@/domain/orders/utils/enrichOrdersWithGeo';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { showToast } from '@/store/toast/toast.slice';

import { Button } from '../ui/Button/Button';
import { ThemedText } from '../ui/ThemedText/ThemedText';

const ACTION_SNIPPETS = {
  [IOrderActionType.GO_TO]: '✅ Выезжаю на адрес',
  [IOrderActionType.ARRIVED_AT]: '📍 Я на месте',
  [IOrderActionType.PICKUP]: '📦 Посылка получена',
  [IOrderActionType.DELIVER]: '🏁 Доставлено',
  [IOrderActionType.COLLECT_PAYMENT]: '💵 Получена оплата',
  [IOrderActionType.PAY_COMMISION]: '📝 Оплатить комиссию',
  [IOrderActionType.COMPLETE_ORDER]: '🎉 Завершить заказ',
};

const LOCATION_DISTANCE_THRESHOLD = 0.5; // km

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
  default: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
};

export interface ICompleteActionSheet {
  action: IOrderAction;
  address: IAddress;
}

export const CompleteActionSheet = React.memo((props: SheetProps<'complete-action-sheet'>) => {
  const { action, address } = props.payload!;

  const { colors } = useTheme();
  const dispatch = useTypedDispatch();
  const location = useTypedSelector(state => state.location);
  const [completeAction, { isLoading }] = useCompleteActionMutation();
  const [error, setError] = useState<string>();

  const snippet = ACTION_SNIPPETS[action.actionType as IOrderActionType];

  const validateLocation = useCallback(async () => {
    try {
      const distance = calculateDistanceToAddress(location, address);
      return distance <= LOCATION_DISTANCE_THRESHOLD;
    } catch (err) {
      console.error('Location validation error:', err);
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
      // if (action.actionType == IOrderActionType.ARRIVED_AT) {
      //   dispatch(removeAddressFromRoute(address.id));
      // }

      SheetManager.hide('complete-action-sheet');
      dispatch(
        showToast({ message: 'Действие подтверждено, спасибо!', type: 'success', timeout: 2000 }),
      );
    } catch (err: any) {
      setError(err.data?.message || ERROR_MESSAGES.default);
    }
  }, [action.id, action.actionType, validateLocation, completeAction, dispatch]);

  const renderAdditionalInfo = () => {
    if (action.actionType === IOrderActionType.PAY_COMMISION) {
      return (
        <ThemedText type='mediumText' weight='bold'>
          {PAY_COMMISION_MESSAGE}
        </ThemedText>
      );
    }
    return null;
  };

  return (
    <ActionSheet
      gestureEnabled={true}
      id={'complete-action-sheet'}
      openAnimationConfig={{
        stiffness: 1000,
        damping: 100000,
        mass: 1,
      }}
      containerStyle={{
        backgroundColor: colors.white,
      }}
    >
      <View style={[styles.sheetContainer, { backgroundColor: colors.background }]}>
        <View style={styles.sheetTextGroup}>
          <ThemedText type='subtitle' weight='medium'>
            Подтверждение выполнения
          </ThemedText>
          <ThemedText type='mediumText'>Пожалуйста, проверьте:</ThemedText>
          <ThemedText type='mediumText'>{action.description} </ThemedText>
        </View>
        {renderAdditionalInfo()}
        {error && (
          <ThemedText type='hint' color='error'>
            {error}
          </ThemedText>
        )}
        <Button onPress={handleCompleteAction} buttonText={snippet} disabled={isLoading} />
      </View>
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
  },
  sheetTextGroup: {
    width: '100%',
    gap: 5,
    alignItems: 'center',
  },
});
