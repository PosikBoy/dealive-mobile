import Orders from "@/components/screens/Orders/Orders";
import { authStorage } from "@/helpers/authStorage";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
  logOut,
} from "@/store/auth/auth.actions";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

const TabsLayout = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  const dispatch = useTypedDispatch();

  const { isAuth, isApproved, error } = useTypedSelector((state) => state.auth);

  const checkAuthStatus = async () => {
    try {
      const storedAuth = await authStorage.getIsAuth();

      if (storedAuth) {
        await dispatch(fetchAuthStatus()).unwrap();
        await dispatch(fetchIsApprovedStatus()).unwrap();
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
    } finally {
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (error) {
    dispatch(logOut());
  }

  // Ничего не рендерим, пока не проверили авторизацию.
  if (!isAppReady) {
    return null;
  }

  if (!isAuth) {
    return <Redirect href={{ pathname: "/(special)/onBoarding" }} />;
  }

  if (!isApproved) {
    return <Redirect href={{ pathname: "/(special)/waitForApproval" }} />;
  }

  return <Orders />;
};

export default TabsLayout;
