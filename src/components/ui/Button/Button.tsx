import { colors } from "@/constants/colors";
import React from "react";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  TouchableHighlightProps,
} from "react-native";

interface IProps extends TouchableHighlightProps {
  buttonText: string;
  onPress: () => void;
  color?: "purple" | "red";
}

const MyButton: React.FC<IProps> = ({
  buttonText,
  onPress,
  color = "purple",
  ...props
}) => {
  const buttonStyles =
    color === "purple" ? styles.buttonPurple : styles.buttonRed;

  const buttonActive =
    color === "purple" ? colors.hoverPurple : colors.hoverRed;
  return (
    <TouchableHighlight
      style={buttonStyles}
      onPress={onPress}
      underlayColor={buttonActive}
      {...props}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonPurple: {
    backgroundColor: colors.purple,
    borderRadius: 100,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  buttonRed: {
    backgroundColor: colors.red,
    borderRadius: 100,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },

  // Дополнительные стили, которые вы хотите добавить
});

export default MyButton;
