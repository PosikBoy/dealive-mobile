import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import MyButton from "@/components/ui/Button/Button";
import ImagePicker from "@/components/ui/ImagePicker/ImagePicker";
import InputFieldWithHandler from "@/components/ui/InputFieldWithHandler/InputFieldWIthHandler";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { addThirdPageData } from "@/store/signupForm/signupForm.slice";
import { register } from "@/store/auth/auth.actions";
import { passportNumberHandler } from "@/helpers/passportHandler";
import { colors } from "@/constants/colors";
import store from "@/store/store";
import { router } from "expo-router";
import Header from "@/components/shared/Header/Header";
import { fonts } from "@/constants/styles";

interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}

interface IImagePickerAsset {
  assetId: string | null;
  base64: string | null; // Если включена опция base64
  duration: number | null; // Если это видео
  exif: Record<string, any> | null; // Если включена опция exif
  fileName: string | null; // Имя файла
  fileSize: number | null; // Размер файла в байтах
  height: number | null; // Высота изображения
  mimeType: string | null; // MIME-тип файла
  rotation: number | null; // Поворот изображения
  type: "image" | "video"; // Тип файла
  uri: string; // URI файла
  width: number | null; // Ширина изображения
}

interface IFormField {
  documentNumber: string;
  selfieWithPassportImage: IImagePickerAsset;
  passportPhotoImage: IImagePickerAsset;
}

const Register3: FC<IProps> = (props) => {
  const { previousPage } = props;

  const signupFormState = useTypedSelector((state) => state.signupForm);
  const { error, isLoading } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFormField>({
    mode: "onChange",
    defaultValues: {
      documentNumber: signupFormState.documentNumber,
      selfieWithPassportImage: signupFormState.documentFiles[0],
      passportPhotoImage: signupFormState.documentFiles[1],
    },
  });

  const onSubmit = async (data: IFormField) => {
    try {
      dispatch(addThirdPageData(data));

      const updatedFormState = store.getState().signupForm;
      await dispatch(register(updatedFormState));
      router.replace("/waitForApproval");
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Header title="Регистрация" onPressBack={previousPage} />
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Введите серию и номер паспорта</Text>
        <View style={styles.inputField}>
          <InputFieldWithHandler
            control={control}
            name="documentNumber"
            placeholder="1234 567890"
            keyboardType="number-pad"
            rules={{
              required: "Введите серию и номер паспорта",
              pattern: {
                value: /^[0-9]{4} [0-9]{6}$/,
                message: "Некорректная серия и номер паспорта",
              },
            }}
            handler={(value) =>
              passportNumberHandler(value, getValues().documentNumber)
            }
          />
        </View>
        {errors?.documentNumber?.message && (
          <Text style={styles.errorText}>
            {errors?.documentNumber?.message}
          </Text>
        )}
      </View>

      <View style={styles.imagePickerContainer}>
        <ImagePicker
          title="Загрузите селфи с паспортом"
          linkSuggestion="https://dealive.ru/selfie-passport.jpg"
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
          linkSuggestion="https://dealive.ru/passport.png"
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

      <View style={styles.loaderErrorContainer}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.purple} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          buttonText="Создать аккаунт"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
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

  errorText: {
    color: "red",
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  imagePickerContainer: {
    height: 100,
    width: "100%",
    marginTop: 10,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: "#000",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loaderErrorContainer: {
    flex: 1,
  },
});
