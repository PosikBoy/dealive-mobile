import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { fonts } from "@/constants/fonts";
import { Slot, SplashScreen } from "expo-router";
import ConnectionCheck from "@/components/other/ConnectionCheck";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const index = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync(fonts);
    setIsAppReady(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (isAppReady) {
    SplashScreen.hideAsync();
  }

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ConnectionCheck>
        <Slot />
      </ConnectionCheck>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default index;
