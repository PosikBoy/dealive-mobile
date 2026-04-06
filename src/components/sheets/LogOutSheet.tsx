import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTypedDispatch } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { logOut } from '@/store/auth/auth.actions';

const STRINGS = {
  TITLE: 'Вы уверены, что хотите выйти из аккаунта?',
  SUBTITLE: 'Вы сможете зайти снова, используя номер телефона и пароль',
  LOGOUT_BUTTON: 'Выйти из аккаунта',
  CANCEL_BUTTON: 'Отмена',
};

const LogOutSheet = () => {
  const { colors } = useTheme();
  const dispatch = useTypedDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = useCallback(async () => {
    setIsLoading(true);

    try {
      await dispatch(logOut()).unwrap();
      SheetManager.hide('log-out-sheet');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return (
    <ActionSheet
      gestureEnabled={true}
      containerStyle={{
        backgroundColor: colors.background,
      }}
      openAnimationConfig={{
        stiffness: 1000, // Уменьшаем жесткость
        damping: 100000, // Увеличиваем затухание
        mass: 1, // Масса (оставляем по умолчанию)
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ThemedText type='subtitle' weight='bold'>
          {STRINGS.TITLE}
        </ThemedText>
        <ThemedText type='mediumText'>{STRINGS.SUBTITLE}</ThemedText>

        <Button
          onPress={handleLogOut}
          buttonText={STRINGS.LOGOUT_BUTTON}
          color='error'
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    </ActionSheet>
  );
};

export default LogOutSheet;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
});
