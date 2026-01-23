import ConnectionCheck from "@/components/contexts/ConnectionCheck";
import LocationProvider from "@/components/contexts/LocationProvider";
import { StoreProvider } from "@/components/contexts/ReduxProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import "@/components/sheets/SheetsManager.tsx";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { persistor } from "@/store/store";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const colorScheme = useColorScheme() || "light";
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(fonts);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1 }}>
        <StoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <SheetProvider>
              <ConnectionCheck>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <StatusBar
                    backgroundColor={
                      colorScheme === "dark"
                        ? colors.dark.statusBarColor
                        : "#fff"
                    }
                  />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: "fade_from_bottom",
                    }}
                  />
                  <LocationProvider />
                </ThemeProvider>
              </ConnectionCheck>
            </SheetProvider>
          </PersistGate>
        </StoreProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Layout;
