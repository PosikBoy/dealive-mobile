import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import React from "react";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  TouchableHighlightProps,
  View,
  ActivityIndicator,
} from "react-native";

interface IProps extends TouchableHighlightProps {
  buttonText?: string;
  onPress: () => void;
  color?: "purple" | "red" | "lightPurple";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  isIconOnly?: boolean;
}

const ACTIVE_COLOR_MAP = {
  purple: colors.hoverPurple,
  red: colors.hoverRed,
  lightPurple: colors.hoverLightPurple, // Убедитесь что цвет есть в constants/colors
};
const MyButton: React.FC<IProps> = (props) => {
  const {
    buttonText,
    onPress,
    color = "purple",
    disabled,
    isLoading,
    children,
    icon,
    isIconOnly = false,
    ...rest
  } = props;

  const renderContent = () => {
    return (
      <View style={styles.contentWrapper}>
        {icon && <View style={styles.iconSize}>{icon}</View>}
        {!isIconOnly && buttonText && (
          <Text style={styles.buttonText}>{buttonText}</Text>
        )}
      </View>
    );
  };

  return (
    <TouchableHighlight
      style={[styles.baseButton, styles[color]]}
      onPress={onPress}
      underlayColor={ACTIVE_COLOR_MAP[color]}
      disabled={disabled || isLoading}
      accessibilityLabel={buttonText}
      {...rest}
    >
      {renderContent()}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    width: "100%",
    minWidth: 48, // Минимальный размер для иконки
  },
  iconOnly: {
    padding: 12, // Меньшие отступы для компактности
  },
  buttonPurple: {
    backgroundColor: colors.purple,
  },
  buttonRed: {
    backgroundColor: colors.red,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.bold,
    marginLeft: 8,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSize: {
    width: 24,
    height: 24,
  },
  purple: {
    backgroundColor: colors.purple,
  },
  red: {
    backgroundColor: colors.red,
  },
  lightPurple: {
    backgroundColor: colors.lightPurple,
  },
});

export default MyButton;
