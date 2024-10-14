import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";
import PhoneInputField from "@/components/ui/PhoneInputField/PhoneInputField";
import MyButton from "@/components/ui/Button/Button";
import arrow from "assets/icons/arrow.png";
import { colors } from "@/constants/colors";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { addFirstPageData } from "@/store/signupForm/signupForm.slice";

interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}

interface IFormField {
  phoneNumber: string;
  code: string;
  password: string;
  repeatPassword: string;
  isAgreementAccepted: boolean;
}

const Register1: FC<IProps> = (props) => {
  const { nextPage, previousPage } = props;
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const state = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      if (timeLeft === 0) {
        setIsActive(false);
        setTimeLeft(60);
      }
      return () => clearInterval(interval);
    }
  }, [timeLeft, isActive]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
  } = useForm<IFormField>({
    mode: "onChange",
    defaultValues: {
      phoneNumber: state.phoneNumber,
      password: state.password,
      code: state.code,
      repeatPassword: state.password,
    },
  });
  const onSubmit = (data) => {
    if (data.password === data.repeatPassword) {
      dispatch(addFirstPageData(data));
      nextPage();
    } else {
      setError("repeatPassword", {
        type: "manual",
        message: "Пароли не совпадают",
      });
    }
  };
  const handleSendCodeButton = () => {
    const phoneNumber = getValues("phoneNumber");
    const regexNumber = /^(\+7|8)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    if (regexNumber.test(phoneNumber)) {
      setIsActive(true);
      setIsCodeSent(true);
    } else {
      setError("phoneNumber", {
        type: "manual",
        message: "Введите номер телефона",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            previousPage();
          }}
        >
          <Image
            source={arrow}
            width={20}
            height={20}
            resizeMode="contain"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Создать аккаунт</Text>
        <View style={{ width: 20 }}></View>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите номер телефона</Text>
        <View style={[styles.inputField, styles.phoneNumberField]}>
          <PhoneInputField
            control={control}
            name="phoneNumber"
            placeholder="Номер телефона"
          />

          <View style={styles.sendCodeButtonContainer}>
            <TouchableOpacity
              disabled={isActive}
              onPress={handleSendCodeButton}
              style={styles.sendCodeButton}
            >
              <Text style={styles.sendCodeButtonText}>
                {isActive ? timeLeft : "Отправить код"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isCodeSent && <Text style={styles.codeSentText}>Код отправлен</Text>}
        {errors?.phoneNumber?.message && (
          <Text style={styles.errorText}>{errors?.phoneNumber?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите код из смс</Text>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name="code"
            placeholder="Код из смс"
            rules={{ required: "Код из смс обязателен" }}
          />
        </View>
        {errors?.code?.message && (
          <Text style={styles.errorText}>{errors?.code?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите пароль</Text>
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
                value: /^[a-zA-Z0-9]+$/,
                message: "Только латинские буквы и цифры",
              },
              minLength: {
                value: 6,
                message: "Минимальная длина пароль - 6 символов",
              },
              maxLength: {
                value: 32,
                message: "Максимальная длина пароль - 32 символов",
              },
            }}
          />
        </View>
        {errors?.password?.message && (
          <Text style={styles.errorText}>{errors?.password?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите пароль повторно</Text>
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
          <Text style={styles.errorText}>
            {errors?.repeatPassword?.message}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <MyButton buttonText="Далее" onPress={handleSubmit(onSubmit)} />
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
  headerText: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
  },
  title: {
    marginTop: 90,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
  },
  fieldContainer: {
    height: 80,
    width: "100%",
    marginTop: 10,
  },
  fieldLabel: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  inputField: {
    marginTop: 10,
    height: 40,
    width: "100%",
  },
  phoneNumberField: {
    position: "relative",
  },
  sendCodeButtonContainer: {
    position: "absolute",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    right: 5,
  },
  sendCodeButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  sendCodeButtonText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
  },
  codeSentText: {
    color: "green",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  repeat: {},
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
});
