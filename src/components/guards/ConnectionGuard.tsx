import NetInfo from '@react-native-community/netinfo';
import { Redirect } from 'expo-router';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

export const ConnectionGuard: FC<PropsWithChildren> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectionStatus(state.isConnected);
    });

    return unsubscribe;
  }, []);

  if (!connectionStatus) {
    return <Redirect href={{ pathname: '/(special)/offline' }} />;
  }

  return <>{children}</>;
};
