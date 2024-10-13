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
  handlePress: () => void;
  color?: "purple" | "red";
}

const MyButton: React.FC<IProps> = ({
  buttonText,
  handlePress,
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
      onPress={handlePress}
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
  },
  buttonRed: {
    backgroundColor: colors.red,
    borderRadius: 100,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
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
