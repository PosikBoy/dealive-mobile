import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

import { SheetManager } from "react-native-actions-sheet";
import Header from "@/components/shared/Header/Header";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const Settings = () => {
  const logoutButtonHandler = async () => {
    SheetManager.show("log-out-sheet");
  };

  return (
    <View style={styles.container}>
      <Header title="Настройки" isButtonBackShown={false} />
      <View style={styles.content}>
        <Link href="/settings/profile">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.profile}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <ThemedText
                weight="bold"
                type="mediumText"
                style={{ flex: 1 }}
                align="left"
              >
                Мой профиль
              </ThemedText>
            </View>
            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={icons.arrow}
                resizeMode="contain"
              />
            </View>
          </View>
        </Link>
        <Link href="/orders/completed">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.orders}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <ThemedText
                weight="bold"
                type="mediumText"
                style={{ flex: 1 }}
                align="left"
              >
                Выполненные заказы
              </ThemedText>
            </View>

            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={icons.arrow}
                resizeMode="contain"
              />
            </View>
          </View>
        </Link>
        <Pressable
          onPress={() => Linking.openURL("https://dealive.ru/courier/faq")}
        >
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.faq}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <ThemedText
                weight="bold"
                type="mediumText"
                style={{ flex: 1 }}
                align="left"
              >
                FAQ
              </ThemedText>
            </View>

            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={icons.arrow}
                resizeMode="contain"
              />
            </View>
          </View>
        </Pressable>

        <Link href="/settings/about">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.application}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <ThemedText
                weight="bold"
                type="mediumText"
                style={{ flex: 1 }}
                align="left"
              >
                О приложении
              </ThemedText>
            </View>
            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={icons.arrow}
                resizeMode="contain"
              />
            </View>
          </View>
        </Link>
        <Pressable
          onPress={() => Linking.openURL("https://t.me/dealivesupport")}
        >
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.telegram}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>{" "}
              <ThemedText
                weight="bold"
                type="mediumText"
                style={{ flex: 1 }}
                align="left"
              >
                Техподдержка в Telegram
              </ThemedText>
            </View>

            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={icons.arrow}
                resizeMode="contain"
              />
            </View>
          </View>
        </Pressable>
        <TouchableOpacity
          onPress={logoutButtonHandler}
          style={styles.logoutButton}
        >
          <ThemedText weight="bold" type="mediumText" color="red" align="left">
            Выйти из профиля
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  header: {
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    height: "100%",
  },
  linkContainer: {
    paddingHorizontal: 20,
    height: 56,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    alignItems: "flex-end",
    width: 20,
    height: 20,
  },
  arrowIcon: {
    transform: [{ rotate: "180deg" }],
    width: 20,
    height: 20,
  },
  linkTextContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  logoutButton: {
    paddingHorizontal: 37,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
});
