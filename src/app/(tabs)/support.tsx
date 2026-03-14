import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Support from '@/components/screens/Support/Support';
import { Header } from '@/components/shared/Header/Header';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

const TabsLayout = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title='Техподдержка' isButtonBackShown={false} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>На данный момент техподдержка работает в Telegram!</Text>
        <Text style={styles.text}>
          Откройте настройки и нажмите на пункт Техподдержка в Telegram!
        </Text>
      </View>
    </View>
  );

  return <Support />;
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  text: {
    fontFamily: fonts.medium,
    backgroundColor: colors.purple,
    padding: 20,

    color: colors.white,
    borderRadius: 20,
  },
});
