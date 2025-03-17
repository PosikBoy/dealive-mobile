import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
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
  const colorScheme = useColorScheme() || "light";
  return (
    <View
      style={[styles.header, { backgroundColor: colors[colorScheme].white }]}
    >
      {isButtonBackShown && (
        <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
          <Image
            tintColor={colors[colorScheme].black}
            source={icons.arrow}
            style={{ width: "100%", height: "100%" }}
          />
        </TouchableOpacity>
      )}
      <ThemedText type="mediumText" weight="bold" style={{ flex: 1 }}>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 35,
    height: 35,
  },
});
