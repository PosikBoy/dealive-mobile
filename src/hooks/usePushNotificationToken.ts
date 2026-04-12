import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useSaveNotificationTokenMutation } from '@/domain/orders/api';
import { useTypedDispatch } from '@/hooks/redux.hooks';
import { showToast } from '@/store/toast/toast.slice';

export const usePushNotificationToken = () => {
  const dispatch = useTypedDispatch();
  const [saveNotificationToken] = useSaveNotificationTokenMutation();

  useEffect(() => {
    const registerPushToken = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          dispatch(
            showToast({
              message: 'Разрешите уведомления, чтобы получать новые заказы',
              type: 'error',
              timeout: 5000,
            }),
          );
          return;
        }

        const { data: token } = await Notifications.getExpoPushTokenAsync();
        await saveNotificationToken({ token });
      } catch (err) {
        // non-critical — silently ignore
      }
    };

    registerPushToken();
  }, []);
};
