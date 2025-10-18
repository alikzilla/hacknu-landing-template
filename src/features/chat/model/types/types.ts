export type Thread = {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: number;
};

export type FilePreview = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  files?: FilePreview[];
  time: string;
};
