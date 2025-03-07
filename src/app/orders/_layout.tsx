import { Stack } from "expo-router";
import React from "react";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    />
  );
};

export default StackLayout;
