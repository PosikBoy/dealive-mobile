import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { Link, router } from "expo-router";
import { colors } from "@/constants/colors";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { logOut } from "@/store/auth/auth.actions";
import { icons } from "@/constants/icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MyButton from "@/components/ui/Button/Button";
import { fonts } from "@/constants/styles";
const Settings = () => {
  const dispatch = useTypedDispatch();
  const ref = useRef<BottomSheetModal>();

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} />
    ),
    []
  );
  const logoutButtonHandler = async () => {
    ref.current.present();
  };

  const logOutHandler = async () => {
    await dispatch(logOut());
    router.replace("/");
  };
  return (
    <View style={styles.container}>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={ref}
        style={{ flex: 1 }}
      >
        <BottomSheetView style={styles.modalLogOut}>
          <Text style={styles.modalLogOutTitle}>
            Вы уверены, что хотите выйти из аккаунта?
          </Text>
          <Text style={styles.modalLogOutSubtitle}>
            Вы сможете зайти заново используя номер телефона и пароль
          </Text>
          <MyButton
            onPress={logOutHandler}
            buttonText="Выйти из аккаунта"
            color="red"
          />
        </BottomSheetView>
      </BottomSheetModal>
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
        {/* <Link href="/settings/notifications">
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
        </Link> */}
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
        {/* <Link href="/settings/invite">
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
        </Link> */}
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
        <TouchableOpacity
          onPress={logoutButtonHandler}
          style={styles.logoutButton}
        >
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
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.red,
  },
  modalLogOut: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 14,
  },
  modalLogOutTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    textAlign: "center",
  },
  modalLogOutSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "center",
  },
});
