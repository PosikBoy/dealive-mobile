import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="main" />
      <Stack.Screen options={{ headerShown: false }} name="login" />
      <Stack.Screen options={{ headerShown: false }} name="register" />
    </Stack>
  );
};

export default AuthLayout;
