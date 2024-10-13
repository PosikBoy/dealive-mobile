import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const AuthLayout = (props: Props) => {
  return (
    <>
      <Slot />
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
