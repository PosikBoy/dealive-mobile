import { colors } from "@/constants/colors";
import { fonts, fontSizes } from "@/constants/styles";
import React, { FC, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ITogglerProps {
  options: string[]; // Массив опций
  activeTab: string; // Активная опция
  onChange: (tab: string) => void; // Функция для изменения активной опции
}

const Toggler: FC<ITogglerProps> = ({ options, activeTab, onChange }) => {
  const [togglerWidth, setTogglerWidth] = useState(options.indexOf(activeTab));
  const animation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animation.value,
            [0, options.length],
            [0, togglerWidth]
          ),
        },
      ],
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTogglerWidth(width);
  };

  return (
    <View style={styles.togglerTypeContainer}>
      <View style={styles.togglerType} onLayout={handleLayout}>
        <Animated.View
          style={[
            styles.indicator,
            animatedStyle,
            { width: togglerWidth / options.length },
          ]}
        />
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            accessible={true}
            accessibilityLabel={`Показать ${option}`}
            onPress={() => {
              if (activeTab !== option) {
                animation.value = withTiming(index, { duration: 200 });
                onChange(option);
              }
            }}
            style={[
              styles.togglerOption,
              { width: togglerWidth / options.length },
            ]}
          >
            <Text
              style={[
                styles.togglerText,
                activeTab === option && styles.activeTogglerText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
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
    justifyContent: "flex-start",
    position: "relative",
    width: "100%",
    borderRadius: 40,
    backgroundColor: "#e0e0e0", // Цвет фона
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#7c4dff", // Цвет индикатора
  },
  togglerText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  togglerOption: {
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTogglerText: {
    color: "#fff", // Цвет текста для активной опции
  },
});
