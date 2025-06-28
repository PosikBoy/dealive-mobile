import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import React, { FC } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  title: string;
  onPressBack?: () => void;
  isButtonBackShown?: boolean;
};

const onPressBackDefault = () => {
  console.log("asdc");
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
        <Pressable style={styles.backButton} onPress={onPressBack}>
          <Image
            tintColor={colors[colorScheme].black}
            source={icons.arrow}
            style={{ width: "100%", height: "100%" }}
          />
        </Pressable>
      )}
      <View>
        <ThemedText type="mediumText" weight="bold">
          {title}
        </ThemedText>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 35,
    height: 35,
  },
});
