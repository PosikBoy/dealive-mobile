import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, useSegments } from "expo-router";
import { colors } from "@/constants/colors";
import tabOrderIcon from "assets/tabs/orders.png";
import tabSettingsIcon from "assets/tabs/settings.png";
import tabChatIcon from "assets/tabs/chat.png";
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.iconContainer}>
        <Image
          style={tabStyles.icon}
          source={icon}
          tintColor={focused ? color : colors.gray}
          resizeMode="contain"
        />
      </View>
      <Text style={focused ? tabStyles.focusedText : tabStyles.text}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const segments = useSegments();

  // Определяем, нужно ли скрывать табы

  const hideTabs =
    segments.includes("[id]") ||
    segments.some((segment) => segment === "completed");

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white, // цвет фона, если требуется
          borderTopWidth: 1, // убираем верхнюю границу
          shadowOpacity: 2, // убираем тень на iOS
          height: 60,
          alignItems: "center",
          display: hideTabs ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          title: "Техподдержка",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={tabChatIcon}
              color={colors.purple}
              name="Техподдержка"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          title: "Заказы",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={tabOrderIcon}
              color={colors.purple}
              name="Заказы"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Настройки",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={tabSettingsIcon}
              color={colors.purple}
              name="Настройки"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    height: 25,
    width: 25,
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  text: {
    width: "100%",

    color: colors.gray,
  },
  focusedText: {
    width: "100%",
    color: colors.purple,
  },
});