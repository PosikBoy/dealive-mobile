import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { fonts } from "@/constants/fonts";
import { Slot, SplashScreen } from "expo-router";
import ConnectionCheck from "@/components/other/ConnectionCheck";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreProvider } from "@/components/ui/ReduxProvider";
import { StatusBar } from "expo-status-bar";
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
        <StoreProvider>
          <StatusBar style="dark" backgroundColor="white" />
          <Slot />
        </StoreProvider>
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
