import { router } from 'expo-router';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Header } from '@/components/shared/Header/Header';
import { Button } from '@/components/ui/Button/Button';
import ImagePicker from '@/components/ui/ImagePicker/ImagePicker';
import { InputField } from '@/components/ui/InputField/InputField';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { register } from '@/store/auth/auth.actions';
import { addThirdPageData } from '@/store/signupForm/signupForm.slice';
import store from '@/store/store';

import { passportNumberHandler } from '../utils';

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
  type: 'image' | 'video'; // Тип файла
  uri: string; // URI файла
  width: number | null; // Ширина изображения
}

interface IFormField {
  documentNumber: string;
  selfieWithPassportImage: IImagePickerAsset;
  passportPhotoImage: IImagePickerAsset;
}

const Register3: FC<IProps> = props => {
  const { colors } = useTheme();
  const { previousPage } = props;

  const signupFormState = useTypedSelector(state => state.signupForm);
  const { error, isLoading } = useTypedSelector(state => state.auth);
  const dispatch = useTypedDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFormField>({
    mode: 'onChange',
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
      router.replace('/waitForApproval');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title='Регистрация' onPressBack={previousPage} />
      <View style={styles.fieldContainer}>
        <ThemedText type='mediumText' align='left'>
          Введите серию и номер паспорта
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name='documentNumber'
            placeholder='1234 567890'
            keyboardType='number-pad'
            rules={{
              required: 'Введите серию и номер паспорта',
              pattern: {
                value: /^[0-9]{4} [0-9]{6}$/,
                message: 'Некорректная серия и номер паспорта',
              },
            }}
            handler={value => passportNumberHandler(value, getValues().documentNumber)}
          />
        </View>
        {errors?.documentNumber?.message && (
          <ThemedText color='error' type='hint' align='left'>
            {errors?.documentNumber?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.imagePickerContainer}>
        <ImagePicker
          title='Загрузите селфи с паспортом'
          linkSuggestion='https://dealive.ru/selfie-passport.jpg'
          control={control}
          name='selfieWithPassportImage'
          rules={{ required: 'Загрузите селфи с паспортом' }}
        />
        {errors?.selfieWithPassportImage?.message && (
          <ThemedText color='error' type='hint' align='left'>
            {errors?.selfieWithPassportImage?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.imagePickerContainer}>
        <ImagePicker
          title='Загрузите фото паспорта'
          linkSuggestion='https://dealive.ru/passport.png'
          control={control}
          name='passportPhotoImage'
          rules={{ required: 'Загрузите фото паспорта' }}
        />
        {errors?.passportPhotoImage?.message && (
          <ThemedText color='error' type='hint' align='left'>
            {errors?.passportPhotoImage?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.loaderErrorContainer}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color={colors.purple} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <ThemedText color='error' type='hint' align='left'>
              {error}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          buttonText='Создать аккаунт'
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
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '100%',
    marginTop: 10,
  },

  inputField: {
    marginTop: 10,
    height: 40,
    width: '100%',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  imagePickerContainer: {
    height: 100,
    width: '100%',
    marginTop: 10,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderErrorContainer: {
    flex: 1,
  },
});
