import { create } from "zustand";
import { ThreadType } from "../types";

type ThreadState = {
  threads: ThreadType[];
  activeId: string | null;
  setActive: (id: string) => void;
  add: (t: ThreadType) => void;
  updateMeta: (id: string, patch: Partial<ThreadType>) => void;
};

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [
    {
      id: "1719e433-4215-4450-9a72-ae2ec5956224",
      title: "Цель: Квартира 70 млн ₸",
      lastMessage: "План на взнос готов",
      updatedAt: Date.now() - 120000,
    },
  ],
  activeId: "1719e433-4215-4450-9a72-ae2ec5956224",
  setActive: (id) => set({ activeId: id }),
  add: (t) => set((s) => ({ threads: [t, ...s.threads] })),
  updateMeta: (id, patch) =>
    set((s) => ({
      threads: s.threads.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
}));
