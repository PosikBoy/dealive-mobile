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

SplashScreen.preventAutoHideAsync();

const layout = () => {
  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <StoreProvider>
        <SheetProvider>
          <GestureHandlerRootView>
            <ConnectionCheck>
              <LocationProvider>
                <StatusBar style="dark" backgroundColor="white" />
                <Stack initialRouteName="(tabs)">
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="orders"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </LocationProvider>
            </ConnectionCheck>
          </GestureHandlerRootView>
        </SheetProvider>
      </StoreProvider>
    </SafeAreaView>
  );
};

export default layout;
