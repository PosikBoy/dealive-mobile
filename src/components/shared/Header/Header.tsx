import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { fonts } from "@/constants/styles";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

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
  return (
    <View style={styles.header}>
      {isButtonBackShown && (
        <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
          <Image
            source={icons.arrow}
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
      )}
      <ThemedText type="mediumText" weight="bold">
        {title}
      </ThemedText>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
  },
});
