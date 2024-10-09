import { View, Text, StyleSheet } from "react-native";
import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <View>
      <Text style={styles.text}>Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    width: "100%",
    fontSize: 30,
    backgroundColor: "red",
  },
});

export default Login;
