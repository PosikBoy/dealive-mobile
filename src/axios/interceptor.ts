import axios, { AxiosError } from 'axios';

import { ServerMessages } from '@/constants/messages';
import { SERVER_URL } from '@/constants/urls';
import { authStorage } from '@/helpers/authStorage';
import { errorCatch } from '@/helpers/errorCatch';
import { authService } from '@/services/auth/auth.service';

import { ApiError, BackendError } from './api-error';

export const instance = axios.create({
  baseURL: SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(async config => {
  const accessToken = await authStorage.getAccessToken();

  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

instance.interceptors.response.use(
  config => config,
  async (error: AxiosError<BackendError>) => {
    const originalRequest = error.config;

    const backendError = error.response?.data;

    const apiError: ApiError = {
      message: backendError?.message ?? error.message ?? ServerMessages.UNKNOWN_ERROR,
      status: backendError.statusCode ?? error.response?.status ?? 500,
      error: backendError?.error,
    };

    if (
      (apiError.status == 401 ||
        errorCatch(error) == ServerMessages.INVALID_TOKEN ||
        errorCatch(error) == ServerMessages.AUTH_REQUIRED) &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return instance.request(originalRequest);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          await authService.logOut();

          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);
