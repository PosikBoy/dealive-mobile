import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { ApiError } from '@/axios/api-error';
import { ICompleteActionSheet } from '@/components/sheets/CompleteActionSheet';
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

export const useOrderActions = (
  order: IOrder | undefined,
  isOfferOrder: boolean,
): UseOrderActionsReturn => {
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
    if (!order?.id) return;
    try {
      await takeOrder({ orderId: order.id }).unwrap();
      SheetManager.hide('take-order-sheet');
    } catch (err) {
      const apiError = err as ApiError;
      dispatch(showToast({ message: apiError.message, type: 'error' }));
    }
  }, [order?.id, takeOrder, dispatch]);

  const takeOrderModalShow = useCallback(() => {
    if (!order) return;
    SheetManager.show('take-order-sheet', {
      payload: {
        order,
        error: error?.message,
        takeOrder: takeOrderHandler,
      },
    });
  }, [order, error?.message, takeOrderHandler]);

  const completeActionModalShow = useCallback(() => {
    if (!completeActionPayload.action || !completeActionPayload.address) return;
    SheetManager.show('complete-action-sheet', {
      payload: completeActionPayload as ICompleteActionSheet,
    });
  }, [completeActionPayload]);

  const openMaps = useCallback(async () => {
    if (!lastAddress?.geoData) {
      return;
    }

    try {
      yandexMaps.getRouteToPoint(lastAddress.geoData.geoLat, lastAddress.geoData.geoLon);
    } catch (err) {}
  }, [lastAddress?.geoData]);

  const callPhone = useCallback(() => {
    if (!lastAddress) {
      return;
    }

    const phoneNumber = 'phoneNumber' in lastAddress ? lastAddress.phoneNumber : '';
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [lastAddress]);

  const declineOrderHandler = useCallback(async () => {
    if (!order?.id) return;
    try {
      await declineOrder(order.id).unwrap();
      dispatch(clearOrderOffer());
      router.back();
    } catch (err) {
      const apiError = err as ApiError;
      dispatch(showToast({ message: apiError.message, type: 'error' }));
    }
  }, [order?.id, declineOrder, dispatch]);

  const handleBackPress = useCallback(async () => {
    if (isOfferOrder && order?.id) {
      try {
        await declineOrder(order.id).unwrap();
        dispatch(clearOrderOffer());
        dispatch(hideAllToasts());
      } catch (err) {
        console.error('Decline on back error:', err);
      }
    }
    router.back();
  }, [isOfferOrder, order?.id, declineOrder, dispatch]);

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
