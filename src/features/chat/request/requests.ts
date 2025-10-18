// src/entities/chat/api/chat.service.ts
import { api, toApiError } from "@/shared/api/api";

export type SendPromptRequest = { content: string };
export type ChatMessageDTO = {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
  id?: string;
};
export type GetChatResponse = {
  id: string;
  data: { messages: ChatMessageDTO[] };
};

export const ChatService = {
  sendPrompt: async (chatId: string, body: SendPromptRequest) => {
    const { data } = await api.post(`/llm-prompt/${chatId}`, body);
    return data; // shape is backend-defined
  },
  getChat: async (chatId: string): Promise<GetChatResponse> => {
    const { data } = await api.get(`/get-chat/${chatId}`);
    return data;
  },
};
