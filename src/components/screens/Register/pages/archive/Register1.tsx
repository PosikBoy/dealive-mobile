import arrow from 'assets/icons/arrow.png';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import MyButton from '@/components/ui/Button/Button';
import InputField from '@/components/ui/InputField/InputField';
import PhoneInputField from '@/components/ui/PhoneInputField/PhoneInputField';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { useTypedSelector } from '@/hooks/redux.hooks';
import authService from '@/services/auth/auth.service';

interface IProps {
  nextPage: () => void;
  previousPage: () => void;
}

interface IFormField {
  phoneNumber: string;
  code: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const Register1: FC<IProps> = props => {
  const { nextPage, previousPage } = props;

  const [existingError, setExistingError] = useState('');
  const state = useTypedSelector(state => state.signupForm);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IFormField>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: state.phoneNumber,
      password: state.password,
      email: state.email,
      code: state.code,
      repeatPassword: state.password,
    },
  });

  const onSubmit = async data => {
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Пароли не совпадают',
      });
      return;
    }

    try {
      await authService.isUserExist({
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setExistingError(error.message);
      }

      return;
    }
    setExistingError('');
    nextPage();
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
            resizeMode='contain'
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <ThemedText type='subtitle' weight='semiBold'>
          Создать аккаунт
        </ThemedText>
        <View style={{ width: 20 }}></View>
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type='mediumText' align='left'>
          Введите номер телефона
        </ThemedText>
        <View style={[styles.inputField, styles.phoneNumberField]}>
          <PhoneInputField control={control} name='phoneNumber' placeholder='Номер телефона' />
        </View>

        {errors?.phoneNumber?.message && (
          <ThemedText type='hint' color='error' align='left'>
            {errors?.phoneNumber?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type='mediumText' align='left'>
          Введите почту
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name='email'
            placeholder='Электронная почта'
            rules={{ required: 'Электронная почта обязательна' }}
          />
        </View>
        {errors?.email?.message && (
          <ThemedText type='hint' color='error' align='left'>
            {errors?.email?.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type='mediumText' align='left'>
          Введите пароль
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name='password'
            placeholder='Пароль'
            type='password'
            rules={{
              required: {
                value: true,
                message: 'Введите пароль',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'Только латинские буквы и цифры',
              },
              minLength: {
                value: 6,
                message: 'Минимальная длина пароль - 6 символов',
              },
              maxLength: {
                value: 32,
                message: 'Максимальная длина пароль - 32 символов',
              },
            }}
          />
        </View>
        {errors?.password?.message && (
          <ThemedText type='hint' color='error' align='left'>
            {errors?.password?.message}
          </ThemedText>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type='mediumText' align='left'>
          Введите пароль повторно
        </ThemedText>
        <View style={styles.inputField}>
          <InputField
            control={control}
            name='repeatPassword'
            placeholder='Пароль повторно'
            type='password'
            rules={{
              required: 'Введите пароль повторно',
            }}
          />
        </View>
        {errors?.repeatPassword?.message && (
          <ThemedText type='hint' color='error' align='left'>
            {errors?.repeatPassword?.message}
          </ThemedText>
        )}
      </View>
      {existingError && (
        <ThemedText type='hint' color='error'>
          {existingError}
        </ThemedText>
      )}
      <View style={styles.buttonContainer}>
        <MyButton buttonText='Далее' onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default Register1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
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
  headerText: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
  },
  title: {
    marginTop: 90,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
  },
  fieldContainer: {
    height: 80,
    width: '100%',
    marginTop: 10,
  },
  fieldLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  inputField: {
    marginTop: 10,
    height: 40,
    width: '100%',
  },
  phoneNumberField: {
    position: 'relative',
  },
  sendCodeButtonContainer: {
    position: 'absolute',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    right: 5,
  },
  sendCodeButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    borderRadius: 20,
    backgroundColor: colors.purple,
  },
  sendCodeButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  codeSentText: {
    color: 'green',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  repeat: {},
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
});
