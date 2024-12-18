import { createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/constants/urls";
import instance from "@/axios/interceptor";
import {
  Attachment,
  IChat,
  IMessage,
  SendMessageDto,
} from "@/types/chat.interface";
import { errorCatch } from "@/helpers/errorCatch";

export class ChatService {
  async createChat() {
    try {
      const response = await instance.post<{}, { data: IChat }>(
        SERVER_URL + "/chats/create",
        {}
      );
      return response?.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error));

      throw Error(error.response.data.message);
    }
  }

  async sendMessage(data: SendMessageDto) {
    try {
      const response = await instance.post<SendMessageDto, { data: IMessage }>(
        SERVER_URL + "/messages",
        data
      );

      return response?.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error));
    }
  }
  async getMessages(chatId: number, page: number) {
    try {
      const response = await instance.get<{}, { data: IMessage[] }>(
        SERVER_URL + `/messages?chatId=${chatId}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log("error", JSON.stringify(error));
    }
  }

  async pollMessages(chatId: number) {
    try {
      const response = await instance.get(
        SERVER_URL + `/messages/poll?chatId=${chatId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
}

const chatService = new ChatService();

export default chatService;
