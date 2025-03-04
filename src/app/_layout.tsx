import React from "react";
import { Stack } from "expo-router";
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

const layout = () => {
  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <StoreProvider>
        <PersistGate loading={null} persistor={persistor}>
          <SheetProvider>
            <GestureHandlerRootView>
              <ConnectionCheck>
                <LocationProvider>
                  <StatusBar style="dark" backgroundColor="white" />
                  <Stack
                    initialRouteName="(tabs)"
                    screenOptions={{ headerShown: false }}
                  >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="orders" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="(auth)" />
                  </Stack>
                </LocationProvider>
              </ConnectionCheck>
            </GestureHandlerRootView>
          </SheetProvider>
        </PersistGate>
      </StoreProvider>
    </SafeAreaView>
  );
};

export default layout;
