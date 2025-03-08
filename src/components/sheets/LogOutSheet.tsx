import { StyleSheet, Text, View } from "react-native";
import React, { useState, useCallback } from "react";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import MyButton from "../ui/Button/Button";
import { fonts, fontSizes } from "@/constants/styles";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { logOut } from "@/store/auth/auth.actions";
import { router } from "expo-router";

// Выносим текстовые константы
const STRINGS = {
  TITLE: "Вы уверены, что хотите выйти из аккаунта?",
  SUBTITLE: "Вы сможете зайти снова, используя номер телефона и пароль",
  LOGOUT_BUTTON: "Выйти из аккаунта",
  CANCEL_BUTTON: "Отмена",
};

const LogOutSheet = () => {
  const dispatch = useTypedDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(logOut()).unwrap();
      router.replace("/");
      SheetManager.hide("log-out-sheet");
    } catch (error) {
      console.error("Logout failed:", error);
      // Здесь можно добавить отображение ошибки пользователю
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // const handleCancel = useCallback(() => {
  //   SheetManager.hide("log-out-sheet");
  // }, []);

  return (
    <ActionSheet
      gestureEnabled={true}
      openAnimationConfig={{
        stiffness: 1000, // Уменьшаем жесткость
        damping: 100000, // Увеличиваем затухание
        mass: 1, // Масса (оставляем по умолчанию)
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{STRINGS.TITLE}</Text>
        <Text style={styles.subtitle}>{STRINGS.SUBTITLE}</Text>

        <MyButton
          onPress={handleLogOut}
          buttonText={STRINGS.LOGOUT_BUTTON}
          color={"red"}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    </ActionSheet>
  );
};

export default LogOutSheet;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.big,
    textAlign: "center",
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
