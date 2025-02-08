import React, { useEffect } from "react";
import { Slot } from "expo-router";
import ConnectionCheck from "@/components/contexts/ConnectionCheck";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreProvider } from "@/components/contexts/ReduxProvider";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import LocationProvider from "@/components/contexts/LocationProvider";
import { colors } from "@/constants/colors";

const layout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ConnectionCheck>
            <StoreProvider>
              <LocationProvider>
                <StatusBar style="dark" backgroundColor="white" />
                <Slot />
              </LocationProvider>
            </StoreProvider>
          </ConnectionCheck>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default layout;
