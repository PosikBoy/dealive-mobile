import { StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import Header from "@/components/shared/Header/Header";

type Props = {};

const MoneyEarned = (props: Props) => {
  return (
    <View>
      <Header title="Заработано" />
    </View>
  );
};

export default MoneyEarned;
