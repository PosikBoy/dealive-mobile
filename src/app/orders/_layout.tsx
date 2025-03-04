import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
    >
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="completed" />
    </Stack>
  );
};

export default StackLayout;
