import NetInfo from '@react-native-community/netinfo';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

import { useTypedDispatch } from '@/hooks/redux.hooks';
import { hideToast, showToast } from '@/store/toast/toast.slice';

const NO_CONNECTION_TOAST_ID = 'no-connection';

export const ConnectionGuard: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useTypedDispatch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (!state.isConnected) {
        dispatch(
          showToast({
            id: NO_CONNECTION_TOAST_ID,
            message: 'Кажется, у вас пропало соединение с интернетом',
            type: 'error',
            persistent: true,
          }),
        );
      } else {
        dispatch(hideToast(NO_CONNECTION_TOAST_ID));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return <>{children}</>;
};
