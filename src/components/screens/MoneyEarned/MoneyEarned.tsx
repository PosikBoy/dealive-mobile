import React from 'react';
import { StyleSheet, View } from 'react-native';

import Header from '@/components/shared/Header/Header';
import { colors } from '@/constants/colors';

type Props = {};

const MoneyEarned = (props: Props) => {
  return (
    <View>
      <Header title='Заработано' />
    </View>
  );
};

export default MoneyEarned;
