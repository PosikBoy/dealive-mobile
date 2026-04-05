import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { IAuthResponseData } from '@/types/auth.interface';
import { IChat } from '@/types/chat.interface';

class AuthStorage {
  REFRESH_TOKEN_KEY = 'refreshToken';
  ACCESS_TOKEN_KEY = 'accessToken';
  IS_AUTH_KEY = 'isAuth';
  SUPPORT_CHAT_KEY = 'supportChat';

  setTokens = async (refreshToken: string, accessToken: string) => {
    await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken);
  };

  removeTokens = async () => {
    await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
  };

  getRefreshToken = async () => {
    const value = await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    return value || null;
  };

  getAccessToken = async () => {
    const value = await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
    return value || null;
  };

  getIsAuth = async () => {
    const value = await SecureStore.getItemAsync(this.IS_AUTH_KEY);
    return value === 'true';
  };

  setIsAuth = async (value: boolean) => {
    await SecureStore.setItemAsync(this.IS_AUTH_KEY, value.toString());
  };

  removeAuthData = async () => {
    await this.setIsAuth(false);
    await this.setSupportChat(null);
    await this.removeTokens();
    try {
      await AsyncStorage.clear();
    } catch {
      // iOS may throw NSFileNoSuchFileError (Code=4) if storage dir doesn't exist yet
    }
  };

  removeIsAuth = async () => {
    await SecureStore.deleteItemAsync(this.IS_AUTH_KEY);
  };

  saveAuthData = async (authData: IAuthResponseData) => {
    await this.setTokens(authData.refreshToken, authData.accessToken);
    await this.setIsAuth(true);
  };

  setSupportChat = async (chat: IChat) => {
    await SecureStore.setItemAsync(this.SUPPORT_CHAT_KEY, JSON.stringify(chat));
  };

  removeSupportChat = async () => {
    await SecureStore.deleteItemAsync(this.SUPPORT_CHAT_KEY);
  };

  getSupportChat = async () => {
    const value = (await SecureStore.getItemAsync(this.SUPPORT_CHAT_KEY)) || '{}';
    return JSON.parse(value);
  };
}

export const authStorage = new AuthStorage();
