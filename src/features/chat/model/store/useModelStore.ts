import { create } from "zustand";

type ModelType = {
  activeModel: "general" | "cumulative" | "accounting";
  setActiveModel: (id: "general" | "cumulative" | "accounting") => void;
};

export const useModelStore = create<ModelType>((set) => ({
  activeModel: "general",
  setActiveModel: (id) => set({ activeModel: id }),
}));
