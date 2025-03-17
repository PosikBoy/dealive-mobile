import { StyleSheet, useColorScheme, View } from "react-native";
import React, { FC } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";
import DataInputField from "@/components/ui/DataInputField/DataInputField";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { addSecondPageData } from "@/store/signupForm/signupForm.slice";
import Header from "@/components/shared/Header/Header";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

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
  const colorScheme = useColorScheme();
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
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <Header title="Регистрация" onPressBack={previousPage} />
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите фамилию
        </ThemedText>

        <View style={[styles.inputField, styles.phoneNumberField]}>
          <InputField
            control={control}
            name="secondName"
            placeholder="Фамилия"
            rules={{ required: "Фамилия обязательна" }}
          />
        </View>
        {errors?.secondName?.message && (
          <ThemedText color="red" type="hint" align="left">
            {errors?.secondName?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите имя
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name="name"
            placeholder="Имя"
            rules={{ required: "Имя обязательно" }}
          />
        </View>
        {errors?.name?.message && (
          <ThemedText color="red" type="hint" align="left">
            {errors?.name?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите отчество
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name="lastName"
            placeholder="Отчество"
            rules={{ required: "Отчество обязательно" }}
          />
        </View>
        {errors?.lastName?.message && (
          <ThemedText color="red" type="hint" align="left">
            {errors?.lastName?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="mediumText" align="left">
          Введите дату рождения
        </ThemedText>
        <View style={styles.inputField}>
          <DataInputField
            control={control}
            name="birthDate"
            placeholder="ДД.ММ.ГГГГ"
          />
        </View>
        {errors?.birthDate?.message && (
          <ThemedText color="red" type="hint" align="left">
            {errors?.birthDate?.message}
          </ThemedText>
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});
