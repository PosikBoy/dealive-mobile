import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React, { FC } from "react";
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
import { icons } from "@/constants/icons";

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
  const authState = useTypedSelector((state) => state.auth);
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
      // Добавляем данные в состояние
      dispatch(addThirdPageData(data));

      // Получаем обновленное состояние
      const updatedFormState = store.getState().signupForm;

      // Отправляем данные на сервер и ожидаем завершения
      const response = await dispatch(register(updatedFormState)).unwrap();
      router.replace("/waitForApproval");
    } catch (error) {}
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
            source={icons.arrow}
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

      <View style={styles.loaderErrorContainer}>
        {authState.isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.purple} />
          </View>
        )}

        {authState.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{authState.error}</Text>
          </View>
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
    fontFamily: "Montserrat-Regular",
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
