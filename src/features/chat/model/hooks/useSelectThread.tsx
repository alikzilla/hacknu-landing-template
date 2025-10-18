import { useThreadStore } from "../store/useThreadStore";

export const useSelectThread = () => useThreadStore((s) => s.setActive);
