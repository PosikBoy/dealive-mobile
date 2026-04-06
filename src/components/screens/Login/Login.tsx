import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button/Button';
import { InputField } from '@/components/ui/InputField/InputField';
import { PhoneInputField } from '@/components/ui/PhoneInputField/PhoneInputField';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper/ScreenWrapper';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { paddings } from '@/constants/styles';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { login } from '@/store/auth/auth.actions';

interface IPhoneNumberPassword {
  phoneNumber: String;
  password: String;
}

export const Login = () => {
  const { colors } = useTheme();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IPhoneNumberPassword>();

  const state = useTypedSelector(state => state.auth);
  const dispatch = useTypedDispatch();

  const onSubmit = async data => {
    try {
      await dispatch(login(data)).unwrap();
      router.replace('/');
    } catch (error) {}
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title} type='title'>
          Войдите в аккаунт
        </ThemedText>
        <ThemedText type='subtitle' weight='bold'>
          Пожалуйста, введите свои данные
        </ThemedText>
        <View style={styles.phoneInputContainer}>
          <PhoneInputField control={control} name='phoneNumber' placeholder='Номер телефона' />
        </View>
        {errors.phoneNumber && (
          <ThemedText type='hint' color='error'>
            {errors?.phoneNumber?.message}
          </ThemedText>
        )}
        <View style={styles.passwordInputContainer}>
          <InputField
            control={control}
            name='password'
            placeholder='Пароль'
            type='password'
            rules={{
              required: 'Пароль обязателен!',
            }}
          />
        </View>
        {errors?.password && (
          <ThemedText type='hint' color='error'>
            {errors?.password?.message}
          </ThemedText>
        )}
        {state.error && (
          <ThemedText type='hint' color='error'>
            {state.error}
          </ThemedText>
        )}
        {state.isLoading && <ActivityIndicator size='large' color={colors.primary} />}

        <View style={styles.bottomContainer}>
          <Button buttonText='Регистрация' onPress={handleRegister} variant='text' />
          <Button buttonText='Войти' onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: paddings.horizontal,
  },
  title: {
    marginTop: 90,
  },
  phoneInputContainer: {
    width: '100%',
    marginTop: 30,
    height: 40,
  },

  passwordInputContainer: {
    marginTop: 20,
    width: '100%',
    height: 40,
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
  },
});
