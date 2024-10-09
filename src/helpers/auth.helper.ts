import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthData, IUserData } from "./auth.types";

class AuthStorage {
  saveTokens = async (refreshToken, accessToken) => {
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("accessToken", accessToken);
  };
  saveUser = async (user: IUserData) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };
  saveAuthData = async (authData: IAuthData) => {
    this.saveTokens(authData.refreshToken, authData.accessToken);
    this.saveUser(authData.userData);
  };
  getAccessToken = async () => {
    try {
      const value = await AsyncStorage.getItem("accessToken");
      return value || null;
    } catch (e) {
      console.log(e);
    }
  };
  getRefreshToken = async () => {
    try {
      const value = await AsyncStorage.getItem("refreshToken");
      return value || null;
    } catch (e) {
      console.log(e);
    }
  };
  getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      const user = JSON.parse(value || "");
      return user || null;
    } catch (e) {
      console.log(e);
    }
  };
  removeTokens = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (e) {
      console.log(e);
    }
  };
  removeUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log(e);
    }
  };
  removeAuthData = async () => {
    this.removeUser();
    this.removeTokens();
  };
}

const authStorage = new AuthStorage();
export default authStorage;
