import { colors } from "@/constants/colors";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
  useColorScheme,
} from "react-native";
import ThemedText from "../ThemedText/ThemedText";

interface ITogglerProps {
  options: string[]; // Массив опций
  activeTab: string; // Активная опция
  onChange: (tab: string) => void; // Функция для изменения активной опции
}

const Toggler: FC<ITogglerProps> = ({ options, activeTab, onChange }) => {
  const colorScheme = useColorScheme() || "light";
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
      <View
        style={[
          styles.togglerType,
          { backgroundColor: colors[colorScheme].lightGray },
        ]}
        onLayout={onTogglerLayout}
      >
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
                style={[
                  option === activeTab && styles.activeTogglerText,
                  {
                    flex: 1,
                  },
                ]}
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
    overflow: "hidden",
    height: 30,
  },
  togglerOption: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "row",
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
