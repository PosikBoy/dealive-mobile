import { StyleSheet, Text, View } from "react-native";
import React from "react";
import About from "@/components/screens/About/About";

type Props = {};

const about = (props: Props) => {
  return (
    <View>
      <About />
    </View>
  );
};

export default about;

const styles = StyleSheet.create({});
