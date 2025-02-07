import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
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

  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
