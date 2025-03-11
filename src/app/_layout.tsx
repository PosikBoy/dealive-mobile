import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import ConnectionCheck from "@/components/contexts/ConnectionCheck";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreProvider } from "@/components/contexts/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LocationProvider from "@/components/contexts/LocationProvider";
import { SheetProvider } from "react-native-actions-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import "@/components/sheets/SheetsManager.tsx";
import { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <StoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <SheetProvider>
              <ConnectionCheck>
                <LocationProvider>
                  <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                  >
                    <StatusBar style="auto" />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: "fade_from_bottom",
                      }}
                    />
                  </ThemeProvider>
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
