import React, { useEffect } from "react";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import ConnectionCheck from "@/components/contexts/ConnectionCheck";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreProvider } from "@/components/contexts/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LocationProvider from "@/components/contexts/LocationProvider";
import { SheetProvider } from "react-native-actions-sheet";

import "@/components/sheets/SheetsManager.tsx";
import { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <StoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <SheetProvider>
              <ConnectionCheck>
                <LocationProvider>
                  <StatusBar style="dark" backgroundColor="white" />
                  <Slot />
                </LocationProvider>
              </ConnectionCheck>
            </SheetProvider>
          </PersistGate>
        </StoreProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Layout;
