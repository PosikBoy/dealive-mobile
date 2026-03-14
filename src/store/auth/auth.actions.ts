import { createAsyncThunk } from '@reduxjs/toolkit';

import { authStorage } from '@/helpers/authStorage';
import { errorCatch } from '@/helpers/errorCatch';
import { authService } from '@/services/auth/auth.service';
import { IAuthResponseData, ILoginRequestData, IRegisterRequestData } from '@/types/auth.interface';

export const register = createAsyncThunk<
  IAuthResponseData,
  IRegisterRequestData,
  { rejectValue: string }
>('auth/registration', async (data, thunkApi) => {
  try {
    const response = await authService.register(data);
    return response;
  } catch (error: any) {
    const errorMessage = errorCatch(error);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk<
  IAuthResponseData,
  ILoginRequestData,
  { rejectValue: string }
>('auth/login', async (data, thunkApi) => {
  try {
    const response = await authService.login(data);

    return response;
  } catch (error: any) {
    console.log('Error in login action', JSON.stringify(error));

    const errorMessage = errorCatch(error);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const logOut = createAsyncThunk('auth/logout', async (_, thunkApi) => {
  try {
    const response = await authService.logOut();

    return response;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const fetchAuthStatus = createAsyncThunk('auth/fetchAuthStatus', async (_, thunkAPI) => {
  try {
    const isAuth = await authStorage.getIsAuth();
    return isAuth;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchIsApprovedStatus = createAsyncThunk(
  'auth/fetchIsApprovedStatus',
  async (_, thunkAPI) => {
    try {
      const isApproved = await authService.checkIsApproved();
      return isApproved;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
