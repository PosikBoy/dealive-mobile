import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { fonts } from "@/constants/fonts";
import { Slot, SplashScreen } from "expo-router";
import ConnectionCheck from "@/components/other/ConnectionCheck";
import { Dimensions, Linking, StyleSheet, View } from "react-native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const index = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  const disableOrientationChange = () => {
    Dimensions.set({
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    });
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync(fonts);
      setIsAppReady(true);
    };
    Linking.addEventListener("url", disableOrientationChange);
    loadFonts();
  }, []);

  if (isAppReady) {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ConnectionCheck>{isAppReady && <Slot />}</ConnectionCheck>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default index;
