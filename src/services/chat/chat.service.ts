import { instance } from '@/axios/interceptor';
import { SERVER_URL } from '@/constants/urls';
import { IChat, IMessage, SendMessageDto } from '@/types/chat.interface';

export class ChatService {
  async createChat() {
    const response = await instance.post<{}, { data: IChat }>(SERVER_URL + '/chats/create', {});
    return response?.data;
  }

  async sendMessage(data: SendMessageDto) {
    const response = await instance.post<SendMessageDto, { data: IMessage }>(
      SERVER_URL + '/messages',
      data,
    );
    return response?.data;
  }

  async getMessages(chatId: number, page: number) {
    const response = await instance.get<{}, { data: IMessage[] }>(
      SERVER_URL + `/messages?chatId=${chatId}&page=${page}`,
    );
    return response.data;
  }

  async pollMessages(chatId: number) {
    const response = await instance.get(SERVER_URL + `/messages/poll?chatId=${chatId}`);

    return response.data;
  }
}

const chatService = new ChatService();

export default chatService;
