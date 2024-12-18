export interface Attachment {
  fileName: string;
}

export interface IMessage {
  id: number;
  senderId: number;
  text: string;
  attachments: Attachment[];
  chatId: number;
  createdAt: Date;
}

export interface IChat {
  id: number;
  creatorId: number;
  type: "dialog" | "group";
  name: string;
  createdAt: Date;
}

export interface SendMessageDto {
  text: string;
  chatId: number;
  attachments?: Attachment[];
}
