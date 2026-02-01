import { router } from 'expo-router';
import React, { FC } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  title: string;
  onPressBack?: () => void;
  isButtonBackShown?: boolean;
};

const onPressBackDefault = () => {
  router.back();
};

const Header: FC<Props> = ({
  title,
  onPressBack = onPressBackDefault,
  isButtonBackShown = true,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      {isButtonBackShown && (
        <Pressable style={styles.backButton} onPress={onPressBack}>
          <Image
            tintColor={colors.tint}
            source={icons.arrow}
            style={{ width: '100%', height: '100%' }}
          />
        </Pressable>
      )}
      <View>
        <ThemedText type='mediumText' weight='bold'>
          {title}
        </ThemedText>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 35,
    height: 35,
  },
});
