import { create } from "zustand";
import { Thread } from "../types";

type ThreadState = {
  threads: Thread[];
  activeId: string | null;
  setActive: (id: string) => void;
  add: (t: Thread) => void;
  updateMeta: (id: string, patch: Partial<Thread>) => void;
};

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [
    {
      id: "t1",
      title: "Цель: Квартира 70 млн ₸",
      lastMessage: "План на взнос готов",
      updatedAt: Date.now() - 120000,
    },
  ],
  activeId: "t1",
  setActive: (id) => set({ activeId: id }),
  add: (t) => set((s) => ({ threads: [t, ...s.threads] })),
  updateMeta: (id, patch) =>
    set((s) => ({
      threads: s.threads.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
}));
