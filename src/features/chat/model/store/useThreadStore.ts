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
      id: "569e23af-d206-411c-887d-44841655b049",
      title: "Цель: Квартира 70 млн ₸",
      lastMessage: "План на взнос готов",
      updatedAt: Date.now() - 120000,
    },
  ],
  activeId: "569e23af-d206-411c-887d-44841655b049",
  setActive: (id) => set({ activeId: id }),
  add: (t) => set((s) => ({ threads: [t, ...s.threads] })),
  updateMeta: (id, patch) =>
    set((s) => ({
      threads: s.threads.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
}));
