import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { colors } from "@/constants/colors";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { logOut } from "@/store/auth/auth.actions";
import { icons } from "@/constants/icons";
const Settings = () => {
  const dispatch = useTypedDispatch();
  const logoutHandler = async () => {
    await dispatch(logOut());
    router.replace("/");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Настройки</Text>
      </View>
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
              <Text style={styles.linkText}>Мой профиль</Text>
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
              <Text style={styles.linkText}>Выполненные заказы</Text>
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
        <Link href="/settings/notifications">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.notifications}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.linkText}>Уведомления</Text>
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
        {/* <Link href="/settings/money">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={moneyIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.linkText}>Мой доход</Text>
            </View>

            <View style={styles.iconContainer}>
              <Image
                style={styles.arrowIcon}
                source={arrowIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </Link> */}
        <Pressable onPress={() => Linking.openURL("https://dealive.ru/about")}>
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.faq}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.linkText}>FAQ</Text>
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
        <Link href="/settings/invite">
          <View style={styles.linkContainer}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Image
                  source={icons.invite}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.linkText}>Пригласить друга</Text>
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
              <Text style={styles.linkText}>О приложении</Text>
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
              </View>
              <Text style={styles.linkText}>Техподдержка в Telegram</Text>
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
        <TouchableOpacity onPress={logoutHandler} style={styles.logoutButton}>
          <Text style={styles.logoutText}> Выйти из профиля</Text>
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
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
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
  linkText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    flex: 1,
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
    // alignItems: "center",
  },
  logoutText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: colors.red,
  },
});
