export type ThreadType = {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: number;
};

export type FilePreviewType = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
};

// Send user prompt
export type SendPromptRequest = {
  content: string; // user message
};

export type SendPromptResponse = {
  // adjust types if backend returns different shape
  success?: boolean;
  // free-form payload from LLM handler:
  data?: any;
  message?: string;
};

// Fetch chat by id
export type ChatMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
};

export type GetChatResponse = {
  id: string; // chat/thread id
  messages: ChatMessage[]; // conversation
  // anything else backend returns:
  [k: string]: any;
};

// src/features/chat/model/types.ts
export type Role = "user" | "assistant" | "system";

export type MessageType = {
  id: string;
  role: Role;
  text: string;
  time: string;
  files?: FilePreviewType[];
  /** client-side states */
  pending?: boolean; // optimistic user msg still sending
  typing?: boolean; // assistant is "typing…"
  error?: string; // failed to send / receive
};
