import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Redirect } from "expo-router";

export default function ConnectionCheck({ children }) {
  const [connectionStatus, setConnectionStatus] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectionStatus(state.isConnected);
    });

    return unsubscribe;
  }, []);

  if (!connectionStatus) {
    return <Redirect href="/offline" />;
  }

  return <View>{children}</View>;
}
