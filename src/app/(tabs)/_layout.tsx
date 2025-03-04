import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, useSegments } from "expo-router";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";

const TabIcon = ({ icon, color, focused }) => {
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
    </View>
  );
};

const CustomTabButton = (props) => (
  <Pressable
    {...props}
    android_ripple={{ color: "transparent" }}
    style={({ pressed }) => [props.style, { opacity: pressed ? 1 : 1 }]}
  />
);

const TabsLayout = () => {
  const segments = useSegments();

  const hideTabs =
    segments.includes("[id]") ||
    segments.some((segment) => segment === "completed");

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.gray,
        tabBarButton: (props) => <CustomTabButton {...props} />,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          shadowOpacity: 2,
          height: 60,
          alignItems: "center",
          display: hideTabs ? "none" : "flex",
        },
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="support"
        options={{
          headerShown: false,
          title: "Техподдержка",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.chat}
              color={colors.purple}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Заказы",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.orders}
              color={colors.purple}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          headerShown: false,
          title: "Маршрут",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.mapDot}
              color={colors.purple}
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
              icon={icons.settings}
              color={colors.purple}
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
    height: 50,
    width: 30,
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
