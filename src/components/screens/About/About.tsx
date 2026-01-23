import React from 'react';
import { Image, StyleSheet, useColorScheme, View } from 'react-native';

import logo from '@/assets/icon.png';
import Header from '@/components/shared/Header/Header';
import ThemedText from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';

const About = () => {
  const colorScheme = useColorScheme() || 'light';
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors[colorScheme].white,
        },
      ]}
    >
      <Header title='О приложении' />
      <View style={styles.content}>
        <Image source={logo} style={{ width: 200, height: 200 }} />
        <ThemedText>Версия приложения: 1.2.0</ThemedText>
        <ThemedText>Создано в учебных целях</ThemedText>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  content: {
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});
