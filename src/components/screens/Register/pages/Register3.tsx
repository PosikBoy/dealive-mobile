import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import InputField from "@/components/ui/InputField/InputField";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import MyButton from "@/components/ui/Button/Button";
import arrow from "assets/icons/arrow.png";
import { colors } from "@/constants/colors";
import DataInputField from "@/components/ui/DataInputField/DataInputField";
import ImagePicker from "@/components/ui/ImagePicker/ImagePicker";
import InputFieldWithHandler from "@/components/ui/InputFieldWithHandler/InputFieldWIthHandler";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { addThirdPageData } from "@/store/signupForm/signupForm.slice";
interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}

interface IFormField {
  passportNumber: string;
  issueDate: string;
  selfieWithPassportImage: Image;
  passportPhotoImage: Image;
}

const Register3: FC<IProps> = (props) => {
  const { nextPage, previousPage } = props;
  const state = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFormField>({
    mode: "onChange",
    defaultValues: {
      passportNumber: state.passportNumber,
      issueDate: state.issueDate,
      selfieWithPassportImage: state.selfieWithPassportImage,
      passportPhotoImage: state.passportPhotoImage,
    },
  });
  const onSubmit = (data: IFormField) => {
    dispatch(addThirdPageData(data));

    nextPage();
  };
  const passportNumberHandler = (newValue: string) => {
    const regex = /[0-9]/;
    const oldValue = getValues("passportNumber") || "";
    if (oldValue.length - newValue.length == 1) {
      return newValue;
    }
    if (regex.test(newValue[newValue.length - 1]) && newValue.length < 12) {
      newValue = newValue.replaceAll(/\D/g, "");
      newValue =
        (newValue[0] ? newValue[0] : "") +
        (newValue[1] ? newValue[1] : "") +
        (newValue[2] ? newValue[2] : "") +
        (newValue[3] ? newValue[3] + " " : "") +
        (newValue[4] ? newValue[4] : "") +
        (newValue[5] ? newValue[5] : "") +
        (newValue[6] ? newValue[6] : "") +
        (newValue[7] ? newValue[7] : "") +
        (newValue[8] ? newValue[8] : "") +
        (newValue[9] ? newValue[9] : "");
      return newValue;
    }
    return oldValue;
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
        <Text style={styles.fieldLabel}>Введите серию и номер паспорта</Text>
        <View style={styles.inputField}>
          <InputFieldWithHandler
            control={control}
            name="passportNumber"
            placeholder="1234 567890"
            keyboardType="number-pad"
            rules={{
              required: "Введите серию и номер паспорта",
              pattern: {
                value: /^[0-9]{4} [0-9]{6}$/,
                message: "Некорректная серия и номер паспорта",
              },
            }}
            handler={passportNumberHandler}
          />
        </View>
        {errors?.passportNumber?.message && (
          <Text style={styles.errorText}>
            {errors?.passportNumber?.message}
          </Text>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите дату выдачи паспорта</Text>
        <View style={styles.inputField}>
          <DataInputField
            control={control}
            name="issueDate"
            placeholder="ДД.ММ.ГГГГ"
          />
        </View>
        {errors?.issueDate?.message && (
          <Text style={styles.errorText}>{errors?.issueDate?.message}</Text>
        )}
      </View>
      <View style={styles.imagePickerContainer}>
        <ImagePicker
          title="Загрузите селфи с паспортом"
          linkSuggestion="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC3n_U6LYAo7YKJf3_jdNfJQNQvV6D2vx0uA&s"
          control={control}
          name="selfieWithPassportImage"
          rules={{ required: "Загрузите селфи с паспортом" }}
        />
        {errors?.selfieWithPassportImage?.message && (
          <Text style={styles.errorText}>
            {errors?.selfieWithPassportImage?.message}
          </Text>
        )}
      </View>

      <View style={styles.imagePickerContainer}>
        <ImagePicker
          title="Загрузите фото паспорта"
          linkSuggestion="https://s3.cms.mts.ru/cms-files/%D1%86%D1%83%D0%B0%D1%86%D1%83%D0%B0%D1%86%D1%83%D0%B0_66ec26dd47fe2c1ddf3d2d04.png"
          control={control}
          name="passportPhotoImage"
          rules={{ required: "Загрузите фото паспорта" }}
        />
        {errors?.passportPhotoImage?.message && (
          <Text style={styles.errorText}>
            {errors?.passportPhotoImage?.message}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          buttonText="Создать аккаунт"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

export default Register3;

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

  errorText: {
    color: "red",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
  imagePickerContainer: {
    height: 100,
    width: "100%",
    marginTop: 10,
  },
});
