import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "@/components/ui/TestInputField/TestInputField";
import { useForm } from "react-hook-form";
import PhoneInputField from "@/components/ui/PhoneInputField/PhoneInputField";
import { Link } from "expo-router";
import MyButton from "@/components/ui/Button/Button";

interface IPhoneNumberPassword {
  phoneNumber: String;
  password: String;
}

const index = (props) => {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<IPhoneNumberPassword>();
  const onSubmit = (data) => {
    console.log(data);
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
          placeholder="Введите пароль"
          type="password"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 6,
              message: "Минимальная длина пароля 6 символов",
            },
            maxLength: {
              value: 20,
              message: "Максимальная длина пароля 20 символов",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
              message: "Пароль должен содержать буквы и цифры",
            },
          })}
        />
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors?.password?.message}</Text>
      )}
      {/* НАДО СДЕЛАТЬ СТРАНИЦУ ВОССТАНОВЛЕНИЯ ПАРОЛЯ */}
      <Link href={"/(auth)/register"} style={styles.forgotPasswordLabel}>
        <Text>Забыли пароль?</Text>
      </Link>
      <View style={styles.buttonContainer}>
        <MyButton buttonText="Войти" onPress={handleSubmit(onSubmit)} />
      </View>
      <Link href={"/(auth)/register"} style={styles.registerLabel}>
        <Text>Регистрация</Text>
      </Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 90,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  phoneInputContainer: {
    width: "100%",
    marginTop: 30,
    height: 40,
  },
  phoneLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
  },
  errorText: {
    alignSelf: "flex-start",
    fontFamily: "Montserrat-SemiBold",
    color: "red",
    fontSize: 12,
  },
  passwordInputContainer: {
    marginTop: 20,
    width: "100%",
    height: 40,
  },
  passwordLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
  },
  forgotPasswordLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    marginTop: 26,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 26,
  },
  registerLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    marginTop: 26,
  },
});
