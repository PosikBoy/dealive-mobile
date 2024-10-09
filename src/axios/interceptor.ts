import authHelper from "@/helpers/auth.helper";
import axios from "axios";
import authService from "@/services/auth/auth.service";
import { errorCatch } from "@/helpers/errorCatch";

const instance = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  const accessToken = authHelper.getAccessToken();
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
      (error.response.status === 401 ||
        errorCatch(error) === "jwt expired" ||
        errorCatch(error) === "Auth required") &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return instance.request(originalRequest);
      } catch (error) {
        if (
          errorCatch(error) === "jwt expired" ||
          errorCatch(error) === "Auth required"
        ) {
          authHelper.removeAuthData();
        }
      }
    }
    throw error;
  }
);

export default instance;
