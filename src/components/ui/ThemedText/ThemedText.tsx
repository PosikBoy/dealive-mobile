import { colors } from "@/constants/colors";
import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps, useColorScheme } from "react-native";

interface IProps extends PropsWithChildren<TextProps> {
  weight?: "semiBold" | "bold" | "medium" | "regular";
  color?: "gray" | "red" | "black" | "white" | "lightGray";
  type?:
    | "heading"
    | "title"
    | "subtitle"
    | "default"
    | "hint"
    | "big"
    | "mediumText";
  align?: "left" | "center";
  key?: React.Key;
}

const lightColors = {
  gray: colors.light.gray,
  lightGray: colors.light.lightGray,
  white: colors.light.white,
  black: colors.light.black,
  red: colors.light.red,
};

const darkColors = {
  gray: colors.dark.gray,
  lightGray: colors.dark.lightGray,
  white: colors.dark.white,
  black: colors.dark.black,
  red: colors.dark.red,
};

const ThemedText = (props: IProps) => {
  const {
    children,
    weight = "regular",
    color = "black",
    style,
    type = "default",
    align = "center",
    key,
    ...rest
  } = props;
  const colorScheme = useColorScheme() || "light";
  const colors = colorScheme === "light" ? lightColors : darkColors;
  const textColor = colors[color];
  return (
    <Text
      {...rest}
      style={[
        styles[weight],
        styles[type],
        styles[align],
        { color: textColor },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default ThemedText;

const styles = StyleSheet.create({
  regular: {
    fontFamily: "CeraRoundPro-Regular",
  },
  semiBold: {
    fontFamily: "CeraRoundPro-SemiBold",
  },
  medium: {
    fontFamily: "CeraRoundPro-Medium",
  },
  bold: {
    fontFamily: "CeraRoundPro-Bold",
  },
  default: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  heading: {
    fontSize: 16,
  },
  big: {
    fontSize: 18,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 20,
  },
  hint: {
    fontSize: 12,
  },
  left: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
});
