import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { fetchSupportChatId, setSupportChatId } from "./supportChat.actions";
export type IInitialState = {
  chatId: number | null;
  createdAt: string | null; // Строка вместо Date
};

const initialState: IInitialState = {
  chatId: null,
  createdAt: null,
};
export const supportChatSlice = createSlice({
  name: "supportChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
    builder
      .addCase(fetchSupportChatId.fulfilled, (state, action) => {
        state.chatId = action.payload.chatId;
        state.createdAt = action.payload.createdAt.toISOString(); // Сохраняем строку
      })
      .addCase(setSupportChatId.fulfilled, (state, action) => {
        state.chatId = action.payload;
      })

      .addCase(fetchSupportChatId.rejected, (state, action) => {});
  },
});
