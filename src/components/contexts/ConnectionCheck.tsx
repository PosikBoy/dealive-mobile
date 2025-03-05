import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";

export default function ConnectionCheck({ children }) {
  const [connectionStatus, setConnectionStatus] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectionStatus(state.isConnected);
    });

    return unsubscribe;
  }, []);

  if (!connectionStatus) {
    router.replace("/offline");
  }

  return <>{children}</>;
}
