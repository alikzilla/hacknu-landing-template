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

export type MessageType = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  files?: FilePreviewType[];
  time: string;
};
