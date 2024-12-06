import authHelper from "@/helpers/auth.helper";
import axios from "axios";
import authService from "@/services/auth/auth.service";
import { errorCatch } from "@/helpers/errorCatch";
import { SERVER_URL } from "@/constants/urls";
import { ServerMessages } from "@/constants/messages";

const instance = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(async (config) => {
  const accessToken = await authHelper.getAccessToken();
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status == 401 ||
        errorCatch(error) == ServerMessages.INVALID_TOKEN ||
        errorCatch(error) == ServerMessages.AUTH_REQUIRED) &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return instance.request(originalRequest);
      } catch (error) {
        if (
          errorCatch(error) === ServerMessages.INVALID_TOKEN ||
          errorCatch(error) === ServerMessages.AUTH_REQUIRED
        ) {
          await authService.logOut();
        }
      }
    }
    throw error;
  }
);
export default instance;
