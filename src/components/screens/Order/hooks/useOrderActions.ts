import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { ApiError } from '@/axios/api-error';
import { useDeclineOrderMutation, useTakeOrderMutation } from '@/domain/orders/api';
import { IOrder } from '@/domain/orders/types';
import { useTypedDispatch } from '@/hooks/redux.hooks';
import { clearOrderOffer } from '@/store/orderOffer/orderOffer.slice';
import { hideAllToasts, showToast } from '@/store/toast/toast.slice';
import { yandexMaps } from '@/utils/yandexMaps';

interface UseOrderActionsReturn {
  isDeclining: boolean;
  takeOrderModalShow: () => void;
  completeActionModalShow: () => void;
  openMaps: () => Promise<void>;
  callPhone: () => void;
  declineOrderHandler: () => Promise<void>;
  handleBackPress: () => Promise<void>;
}

export const useOrderActions = (order: IOrder, isOfferOrder: boolean): UseOrderActionsReturn => {
  const dispatch = useTypedDispatch();
  const [takeOrder, { error }] = useTakeOrderMutation();
  const [declineOrder, { isLoading: isDeclining }] = useDeclineOrderMutation();

  const lastAction = order?.actions?.find(action => !action.isCompleted);
  const lastAddress = order?.addresses?.find(address => address.id === lastAction?.addressId);

  const completeActionPayload = useMemo(
    () => ({ address: lastAddress, action: lastAction }),
    [lastAddress, lastAction],
  );

  const takeOrderHandler = useCallback(async () => {
    try {
      await takeOrder({ orderId: order.id }).unwrap();
      SheetManager.hide('take-order-sheet');
    } catch (err) {
      const apiError = err as ApiError;
      dispatch(showToast({ message: apiError.message, type: 'error' }));
    }
  }, [order.id, takeOrder, dispatch]);

  const takeOrderModalShow = useCallback(() => {
    SheetManager.show('take-order-sheet', {
      payload: {
        order,
        error: error?.message,
        takeOrder: takeOrderHandler,
      },
    });
  }, [order, error?.message, takeOrderHandler]);

  const completeActionModalShow = useCallback(() => {
    SheetManager.show('complete-action-sheet', {
      payload: completeActionPayload,
    });
  }, [completeActionPayload]);

  const openMaps = useCallback(async () => {
    if (!lastAddress?.geoData) {
      console.error('No address or geodata available');
      return;
    }

    try {
      yandexMaps.getRouteToPoint(lastAddress.geoData.geoLat, lastAddress.geoData.geoLon);
    } catch (err) {
      console.error('Ошибка при открытии URL:', err);
    }
  }, [lastAddress?.geoData]);

  const callPhone = useCallback(() => {
    if (!lastAddress) {
      console.error('No address available');
      return;
    }

    const phoneNumber = 'phoneNumber' in lastAddress ? lastAddress.phoneNumber : '';
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [lastAddress]);

  const declineOrderHandler = useCallback(async () => {
    try {
      await declineOrder(order.id).unwrap();
      dispatch(clearOrderOffer());
      router.back();
    } catch (err) {
      const apiError = err as ApiError;
      dispatch(showToast({ message: apiError.message, type: 'error' }));
    }
  }, [order.id, declineOrder, dispatch]);

  const handleBackPress = useCallback(async () => {
    if (isOfferOrder) {
      try {
        await declineOrder(order.id).unwrap();
        dispatch(clearOrderOffer());
        dispatch(hideAllToasts());
      } catch (err) {
        console.error('Decline on back error:', err);
      }
    }
    router.back();
  }, [isOfferOrder, order.id, declineOrder, dispatch]);

  return {
    isDeclining,
    takeOrderModalShow,
    completeActionModalShow,
    openMaps,
    callPhone,
    declineOrderHandler,
    handleBackPress,
  };
};
