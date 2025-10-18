// src/features/chat/model/store/useMessageStore.ts
import { create } from "zustand";
import { MessageType } from "../types";

type State = {
  byThread: Record<string, MessageType[]>;
};

type Actions = {
  push: (threadId: string, m: MessageType) => void;
  setForThread: (threadId: string, list: MessageType[]) => void;
  updateById: (
    threadId: string,
    id: string,
    patch: Partial<MessageType>
  ) => void;
  removeById: (threadId: string, id: string) => void;
};

export const useMessageStore = create<State & Actions>()((set) => ({
  byThread: {},

  push: (threadId, m) =>
    set((s) => ({
      byThread: {
        ...s.byThread,
        [threadId]: [...(s.byThread[threadId] ?? []), m],
      },
    })),

  setForThread: (threadId, list) =>
    set((s) => ({ byThread: { ...s.byThread, [threadId]: list } })),

  updateById: (threadId, id, patch) =>
    set((s) => ({
      byThread: {
        ...s.byThread,
        [threadId]: (s.byThread[threadId] ?? []).map((m) =>
          m.id === id ? { ...m, ...patch } : m
        ),
      },
    })),

  removeById: (threadId, id) =>
    set((s) => ({
      byThread: {
        ...s.byThread,
        [threadId]: (s.byThread[threadId] ?? []).filter((m) => m.id !== id),
      },
    })),
}));
