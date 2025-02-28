import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="completed"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;
