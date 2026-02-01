import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';

export const OnBoardingItem = ({ title, subtitle, iconUri }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image source={iconUri} style={[styles.image, { width, resizeMode: 'contain' }]} />
      <View style={styles.textContainer}>
        <ThemedText type='title' weight='bold' style={{ textAlign: 'left' }}>
          {title}
        </ThemedText>
        <ThemedText type='mediumText' style={{ textAlign: 'left' }}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    gap: 15,
  },
});
