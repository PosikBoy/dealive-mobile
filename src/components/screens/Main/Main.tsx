import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';

import MyButton from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

import { t } from './i18n';

export const Main = () => {
  const { theme, colors } = useTheme();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.textContainer}>
        <ThemedText type='title' weight='bold' align='left'>
          {t('title')}
        </ThemedText>
      </View>
      <ThemedText type='subtitle' weight='bold' align='left'>
        {t('subtitle')}
      </ThemedText>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={icons.box} resizeMode='contain' />
      </View>
      <View style={styles.buttonContainer}>
        <MyButton buttonText={t('button-sign-in-text')} onPress={handleLogin} />
        <MyButton buttonText={t('button-register-text')} onPress={handleRegister} />
        <TouchableHighlight
          style={styles.registerButton}
          onPress={handleRegister}
          underlayColor={colors.background}
        >
          <ThemedText style={styles.registerLabel}>{t('button-register-text')}</ThemedText>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  textContainer: {
    marginTop: 64,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  imageContainer: {
    marginTop: 50,
    height: 300,
    width: 300,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    marginTop: 50,
    width: '100%',
    gap: 15,
    flex: 1,
  },
  registerButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  registerLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
});
