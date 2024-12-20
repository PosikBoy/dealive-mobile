import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";

import PhoneInputField from "@/components/ui/PhoneInputField/PhoneInputField";
import { Link, router } from "expo-router";
import MyButton from "@/components/ui/Button/Button";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { login } from "@/store/auth/auth.actions";
import { colors } from "@/constants/colors";
import { SERVER_URL } from "@/constants/urls";
import { fonts, fontSizes, paddings } from "@/constants/styles";

interface IPhoneNumberPassword {
  phoneNumber: String;
  password: String;
}

const Login = () => {
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
      router.replace("/waitForApproval");
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войдите в аккаунт</Text>
      <Text style={styles.subtitle}>Пожалуйста, введите свои данные</Text>
      <View style={styles.phoneInputContainer}>
        <PhoneInputField
          control={control}
          name="phoneNumber"
          placeholder="Номер телефона"
        />
      </View>
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors?.phoneNumber?.message}</Text>
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
        <Text style={styles.errorText}>{errors?.password?.message}</Text>
      )}
      {/* НАДО СДЕЛАТЬ СТРАНИЦУ ВОССТАНОВЛЕНИЯ ПАРОЛЯ */}
      {state.error && <Text style={styles.errorText}>{state.error}</Text>}
      {state.isLoading && (
        <ActivityIndicator size="large" color={colors.purple} />
      )}
      {/* <Link href={"/(auth)/register"} style={styles.forgotPasswordLabel}>
        <Text>Забыли пароль?</Text>
      </Link> */}
      <View style={styles.bottomContainer}>
        <Link href={"/(auth)/register"} style={styles.registerLabel}>
          <Text>Регистрация</Text>
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
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.big,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
  },
  phoneInputContainer: {
    width: "100%",
    marginTop: 30,
    height: 40,
  },
  phoneLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.small,
  },
  errorText: {
    alignSelf: "flex-start",
    fontFamily: fonts.semiBold,
    color: colors.red,
    fontSize: fontSizes.small,
  },
  passwordInputContainer: {
    marginTop: 20,
    width: "100%",
    height: 40,
  },
  passwordLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.medium,
  },
  forgotPasswordLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.big,
    marginTop: 26,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 26,
  },
  registerLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.big,
    marginTop: 26,
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
    bottom: 20,
  },
});
