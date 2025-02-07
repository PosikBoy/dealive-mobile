import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";
import DataInputField from "@/components/ui/DataInputField/DataInputField";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { addSecondPageData } from "@/store/signupForm/signupForm.slice";
import Header from "@/components/shared/Header/Header";
import { fonts } from "@/constants/styles";

interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}
interface IFormField {
  name: string;
  secondName: string;
  lastName: string;
  birthDate: string;
}

const Register2: FC<IProps> = (props) => {
  const { nextPage, previousPage } = props;
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
      name: state.name,
      secondName: state.secondName,
      lastName: state.lastName,
      birthDate: state.birthDate,
    },
  });
  const onSubmit = (data) => {
    if (isValidDate(data.birthDate)) {
      dispatch(addSecondPageData(data));
      nextPage();
    } else {
      setError("birthDate", {
        type: "manual",
        message: "Некорректная дата",
      });
    }
  };

  function isValidDate(dateString) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const [day, month, year] = dateString.split(".").map(Number);

    const date = new Date(year, month - 1, day);
    const currentDate = new Date();

    const isDataCorrect =
      date < currentDate &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
    return isDataCorrect;
  }

  return (
    <View style={styles.container}>
      <Header title="Регистрация" onPressBack={previousPage} />
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите фамилию</Text>
        <View style={[styles.inputField, styles.phoneNumberField]}>
          <InputField
            control={control}
            name="secondName"
            placeholder="Фамилия"
            rules={{ required: "Фамилия обязательна" }}
          />
        </View>
        {errors?.secondName?.message && (
          <Text style={styles.errorText}>{errors?.secondName?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите имя</Text>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name="name"
            placeholder="Имя"
            rules={{ required: "Имя обязательно" }}
          />
        </View>
        {errors?.name?.message && (
          <Text style={styles.errorText}>{errors?.name?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите отчество</Text>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name="lastName"
            placeholder="Отчество"
            rules={{ required: "Отчество обязательно" }}
          />
        </View>
        {errors?.lastName?.message && (
          <Text style={styles.errorText}>{errors?.lastName?.message}</Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите дату рождения</Text>
        <View style={styles.inputField}>
          <DataInputField
            control={control}
            name="birthDate"
            placeholder="ДД.ММ.ГГГГ"
          />
        </View>
        {errors?.birthDate?.message && (
          <Text style={styles.errorText}>{errors?.birthDate?.message}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <MyButton buttonText="Далее" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default Register2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.white,
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
    fontFamily: fonts.semiBold,
  },
  title: {
    marginTop: 90,
    fontFamily: fonts.semiBold,
    fontSize: 24,
  },
  fieldContainer: {
    height: 80,
    width: "100%",
    marginTop: 10,
  },
  fieldLabel: {
    fontFamily: fonts.regular,
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
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  sendCodeButtonText: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  codeSentText: {
    color: "green",
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  repeat: {},
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});
