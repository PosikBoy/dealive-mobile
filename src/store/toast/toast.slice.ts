import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'info' | 'success' | 'error';

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
  timeout: number;
  persistent: boolean;
}

interface IToastState {
  toasts: IToast[];
}

const initialState: IToastState = {
  toasts: [],
};

interface IShowToastPayload {
  id?: string;
  message: string;
  type?: ToastType;
  timeout?: number;
  persistent?: boolean;
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<IShowToastPayload>) => {
      const id = action.payload.id ?? `toast-${Date.now()}`;
      const exists = state.toasts.find(t => t.id === id);
      if (exists) return;

      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type ?? 'info',
        timeout: action.payload.timeout ?? 10000,
        persistent: action.payload.persistent ?? false,
      });
    },
    hideToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    hideAllToasts: state => {
      state.toasts = [];
    },
  },
});

export const { showToast, hideToast, hideAllToasts } = toastSlice.actions;
