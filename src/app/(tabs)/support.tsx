import React from "react";
import Support from "@/components/screens/Support/Support";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/styles";
import { colors } from "@/constants/colors";

const TabsLayout = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        На данный момент техподдержка работает в Telegram!
      </Text>
      <Text style={styles.text}>
        Откройте настройки и нажмите на пункт Техподдержка в Telegram!
      </Text>
    </View>
  );
  // return <Support />;
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  text: {
    fontFamily: fonts.medium,
    backgroundColor: colors.purple,
    padding: 20,

    color: colors.white,
    borderRadius: 20,
  },
});
