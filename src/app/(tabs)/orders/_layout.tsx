import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade", // Анимация справа налево
        gestureEnabled: true, // Включает свайп-назад на Android
        headerShown: false, // Скрываем хедер, если не нужен
      }}
    />
  );
}
