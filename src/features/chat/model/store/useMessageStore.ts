import { create } from "zustand";
import { Message } from "../types";

type MessageState = {
  byThread: Record<string, Message[]>;
  push: (threadId: string, msg: Message) => void;
  clear: (threadId: string) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
  byThread: {
    t1: [
      {
        id: "m1",
        role: "assistant",
        text: "Ассаляму алейкум! Какая цель и доход?",
        time: "10:10",
      },
    ],
  },
  push: (id, msg) =>
    set((s) => ({
      byThread: { ...s.byThread, [id]: [...(s.byThread[id] ?? []), msg] },
    })),
  clear: (id) => set((s) => ({ byThread: { ...s.byThread, [id]: [] } })),
}));
