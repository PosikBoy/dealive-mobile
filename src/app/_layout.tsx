import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { fonts } from "@/constants/fonts";
import { Slot, SplashScreen } from "expo-router";
import ConnectionCheck from "@/components/other/ConnectionCheck";
import { StyleSheet, View } from "react-native";
import Login from "@/components/screens/Login/Login";

SplashScreen.preventAutoHideAsync();

const index = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      setIsAppReady(true);
    }
  }, [fontsLoaded]);

  if (isAppReady) {
    SplashScreen.hideAsync();
  }

  return (
    <View style={styles.container}>
      <ConnectionCheck>
        <Slot />
      </ConnectionCheck>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default index;
