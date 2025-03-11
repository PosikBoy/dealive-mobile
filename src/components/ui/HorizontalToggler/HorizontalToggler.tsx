import { colors } from "@/constants/colors";
import { fonts, fontSizes } from "@/constants/styles";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import ThemedText from "../ThemedText/ThemedText";

interface ITogglerProps {
  options: string[]; // Массив опций
  activeTab: string; // Активная опция
  onChange: (tab: string) => void; // Функция для изменения активной опции
}

const Toggler: FC<ITogglerProps> = ({ options, activeTab, onChange }) => {
  const [togglerWidth, setTogglerWidth] = useState(0);

  const tabAnimation = useRef(
    new Animated.Value(options.indexOf(activeTab))
  ).current;

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
    <View style={styles.togglerTypeContainer}>
      <View style={styles.togglerType} onLayout={onTogglerLayout}>
        <Animated.View
          style={[
            styles.indicator,
            { transform: [{ translateX: indicatorTranslateX }] },
            { width: togglerWidth / options.length },
          ]}
        />
        {options.map((option) => {
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.togglerOption,
                { width: togglerWidth / options.length },
              ]}
              onPress={() => handlePress(option)}
            >
              <ThemedText
                type="default"
                style={[option === activeTab && styles.activeTogglerText]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Toggler;

const styles = StyleSheet.create({
  togglerTypeContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  togglerType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
  },
  togglerOption: {
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTogglerText: {
    color: colors.white,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: colors.purple,
    zIndex: -1,
  },
});
