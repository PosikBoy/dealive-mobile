import Header from "@/components/shared/Header/Header";
import MyButton from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField/InputField";
import PhoneInputField from "@/components/ui/PhoneInputField/PhoneInputField";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { colors } from "@/constants/colors";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import authService from "@/services/auth/auth.service";
import { addFirstPageData } from "@/store/signupForm/signupForm.slice";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}

interface IFormField {
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const Register1: FC<IProps> = (props) => {
  const colorScheme = useColorScheme() || "light";
  const { nextPage, previousPage } = props;

  const [existingError, setExistingError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const state = useTypedSelector((state) => state.signupForm);
  const dispatch = useTypedDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IFormField>({
    mode: "onChange",
    defaultValues: {
      phoneNumber: state.phoneNumber,
      password: state.password,
      email: state.email,
      repeatPassword: state.password,
    },
  });

  const onSubmit = async (data: IFormField) => {
    if (data.password !== data.repeatPassword) {
      setError("repeatPassword", {
        type: "manual",
        message: "Пароли не совпадают",
      });
      return;
    }
    try {
      setIsLoading(true);
      setExistingError("");

      await authService.isUserExist({
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    } catch (error) {
      setIsLoading(false);
      setExistingError(error.message);
      return;
    }
    setIsLoading(false);
    dispatch(addFirstPageData(data));
    setExistingError("");
    nextPage();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <Header title="Регистрация" onPressBack={previousPage} />
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите номер телефона
        </ThemedText>
        <View style={[styles.inputField, styles.phoneNumberField]}>
          <PhoneInputField
            control={control}
            name="phoneNumber"
            placeholder="Номер телефона"
          />
        </View>
        {errors?.phoneNumber?.message && (
          <ThemedText type="hint" color="red" align="left">
            {errors?.phoneNumber?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите почту
        </ThemedText>

        <View style={styles.inputField}>
          <InputField
            control={control}
            name="email"
            placeholder="Электронная почта"
            rules={{
              required: "Электронная почта обязательна",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Некорректный формат электронной почты",
              },
            }}
          />
        </View>
        {errors?.email?.message && (
          <ThemedText type="hint" color="red" align="left">
            {errors?.email?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите пароль
        </ThemedText>

        <View style={styles.inputField}>
          <InputField
            control={control}
            name="password"
            placeholder="Пароль"
            type="password"
            rules={{
              required: {
                value: true,
                message: "Введите пароль",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,40}$/,
                message:
                  "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один спецсимвол (@$!%*?&)",
              },
              minLength: {
                value: 6,
                message: "Минимальная длина пароль - 6 символов",
              },
              maxLength: {
                value: 40,
                message: "Максимальная длина пароль - 40 символов",
              },
            }}
          />
        </View>
        {errors?.password?.message && (
          <ThemedText type="hint" color="red" align="left">
            {errors?.password?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите пароль повторно
        </ThemedText>

        <View style={styles.inputField}>
          <InputField
            control={control}
            name="repeatPassword"
            placeholder="Пароль повторно"
            type="password"
            rules={{
              required: "Введите пароль повторно",
            }}
          />
        </View>
        {errors?.repeatPassword?.message && (
          <ThemedText type="hint" color="red" align="left">
            {errors?.repeatPassword?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.loaderErrorContainer}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.purple} />
          </View>
        )}
        {existingError && (
          <View style={styles.errorContainer}>
            <ThemedText type="hint" color="red">
              {existingError}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          buttonText="Далее"
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default Register1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  arrowButton: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  arrowIcon: {
    width: 25,
    height: 25,
  },

  fieldContainer: {
    height: 80,
    width: "100%",
    marginTop: 10,
  },

  inputField: {
    marginTop: 10,
    height: 40,
    width: "100%",
  },
  phoneNumberField: {
    position: "relative",
  },
  repeat: {},
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loaderErrorContainer: {
    flex: 1,
  },
});
