import * as SecureStore from "expo-secure-store";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface IChat {
  chatId: number;
  createdAt: Date;
}

export const fetchSupportChatId = createAsyncThunk<
  IChat,
  void,
  { rejectValue: string }
>("supportChat/fetchSupportChatId", async (_, thunkAPI) => {
  try {
    const supportChat = await SecureStore.getItemAsync("supportChat");
    if (!supportChat) {
      return thunkAPI.rejectWithValue("No support chat found");
    }

    const parsedChat: { chatId: number; createdAt: string } =
      JSON.parse(supportChat);

    // Возвращаем сериализуемые данные (создаем строку из даты)
    return {
      chatId: parsedChat.chatId,
      createdAt: parsedChat.createdAt, // Уже строка
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch support chat"
    );
  }
});

export const setSupportChatId = createAsyncThunk(
  "supportChat/setSupportChatId",
  async (chatId: number, thunkAPI) => {
    try {
      await SecureStore.setItemAsync(
        "supportChat",
        JSON.stringify({
          chatId: chatId,
          createdAt: new Date().toISOString(),
        })
      );
      return chatId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to set support chat"
      );
    }
  }
);
