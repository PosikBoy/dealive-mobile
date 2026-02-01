import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { useTheme } from '@/hooks/useTheme';

interface ITogglerProps {
  options: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  styles?: StyleProp<ViewStyle>;
}

const Toggler: FC<ITogglerProps> = ({ options, activeTab, onChange, styles: providedStyles }) => {
  const { colors } = useTheme();
  const [togglerWidth, setTogglerWidth] = useState(0);

  const tabAnimation = useRef(new Animated.Value(options.indexOf(activeTab))).current;

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: options.indexOf(activeTab),
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [activeTab, tabAnimation]);

  const onTogglerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    setTogglerWidth(width);
  };

  const handlePress = (tab: string) => {
    onChange(tab);
  };

  const indicatorTranslateX = useMemo(() => {
    return tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, togglerWidth / options.length],
    });
  }, [tabAnimation, togglerWidth]);

  return (
    <View
      style={[styles.togglerType, { backgroundColor: colors.backgroundSecondary }, providedStyles]}
      onLayout={onTogglerLayout}
    >
      <Animated.View
        style={[
          styles.indicator,
          { transform: [{ translateX: indicatorTranslateX }] },
          { width: togglerWidth / options.length },
        ]}
      />
      {options.map(option => {
        return (
          <TouchableOpacity
            key={option}
            style={[styles.togglerOption, { width: togglerWidth / options.length }]}
            onPress={() => handlePress(option)}
          >
            <ThemedText
              type='default'
              style={[styles.togglerText, option === activeTab && styles.activeTogglerText]}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Toggler;

const styles = StyleSheet.create({
  togglerType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    height: 30,
  },
  togglerOption: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'row',
  },
  togglerText: {
    flex: 1,
  },
  activeTogglerText: {
    color: colors.white,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: colors.purple,
    zIndex: -1,
  },
});
