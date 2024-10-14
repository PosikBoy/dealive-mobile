import React, { useEffect } from "react";
import { Redirect, router, Slot } from "expo-router";
import { Text, View } from "react-native";

const index = () => {
  return (
    <View>
      <Redirect href="/onBoarding" />
    </View>
  );
};

export default index;
