import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { Redirect, router } from "expo-router";
import { colors } from "@/constants/colors";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
} from "@/store/auth/auth.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const dispatch = useTypedDispatch();
  const { isAuth, isApproved, isLoading, error } = useTypedSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    dispatch(fetchAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchIsApprovedStatus());
    }
  }, [isAuth]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{"you are at index page" + error}</Text>
      </View>
    );
  }

  if (!isAuth) {
    return <Redirect href="/onBoarding" />;
  }
  if (!isApproved) {
    return <Redirect href="/waitForApproval" />;
  }

  return <Redirect href="/orders/main" />;
};

export default index;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  subtitle: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  imageContainer: {
    marginTop: 50,
    height: 200,
    width: 200,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    width: "100%",
    marginTop: 50,
  },
});
