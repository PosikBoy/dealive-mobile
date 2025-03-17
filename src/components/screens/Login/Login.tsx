import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";

import PhoneInputField from "@/components/ui/PhoneInputField/PhoneInputField";
import { Link, router } from "expo-router";
import MyButton from "@/components/ui/Button/Button";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { login } from "@/store/auth/auth.actions";
import { colors } from "@/constants/colors";
import { fonts, fontSizes, paddings } from "@/constants/styles";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

interface IPhoneNumberPassword {
  phoneNumber: String;
  password: String;
}

const Login = () => {
  const colorScheme = useColorScheme();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IPhoneNumberPassword>();

  const state = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      router.replace("/");
    } catch (error) {}
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <ThemedText style={styles.title} type="title">
        Войдите в аккаунт
      </ThemedText>
      <ThemedText type="subtitle" weight="bold">
        Пожалуйста, введите свои данные
      </ThemedText>
      <View style={styles.phoneInputContainer}>
        <PhoneInputField
          control={control}
          name="phoneNumber"
          placeholder="Номер телефона"
        />
      </View>
      {errors.phoneNumber && (
        <ThemedText type="hint" color="red">
          {errors?.phoneNumber?.message}
        </ThemedText>
      )}
      <View style={styles.passwordInputContainer}>
        <InputField
          control={control}
          name="password"
          placeholder="Пароль"
          type="password"
          rules={{
            required: "Пароль обязателен!",
          }}
        />
      </View>
      {errors?.password && (
        <ThemedText type="hint" color="red">
          {errors?.password?.message}
        </ThemedText>
      )}
      {/* НАДО СДЕЛАТЬ СТРАНИЦУ ВОССТАНОВЛЕНИЯ ПАРОЛЯ */}
      {state.error && (
        <ThemedText type="hint" color="red">
          {state.error}
        </ThemedText>
      )}
      {state.isLoading && (
        <ActivityIndicator size="large" color={colors.purple} />
      )}
      {/* <Link href={"/(auth)/register"} style={styles.forgotPasswordLabel}>
        <Text>Забыли пароль?</Text>
      </Link> */}
      <View style={styles.bottomContainer}>
        <Link href={"/(auth)/register"}>
          <ThemedText type="mediumText" weight="bold">
            Регистрация
          </ThemedText>
        </Link>
        <View style={styles.buttonContainer}>
          <MyButton buttonText="Войти" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: paddings.horizontal,
  },
  title: {
    marginTop: 90,
  },
  phoneInputContainer: {
    width: "100%",
    marginTop: 30,
    height: 40,
  },

  passwordInputContainer: {
    marginTop: 20,
    width: "100%",
    height: 40,
  },

  buttonContainer: {
    width: "100%",
    marginTop: 26,
  },

  bottomContainer: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
    bottom: 20,
  },
});
