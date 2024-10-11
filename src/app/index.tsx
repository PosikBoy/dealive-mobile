import React, { useEffect } from "react";
import { Redirect, router } from "expo-router";
import { View } from "react-native";

const index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Redirect href="/onBoarding" />
    </View>
  );
};

export default index;
