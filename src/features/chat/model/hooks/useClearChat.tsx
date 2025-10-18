import { useMessageStore } from "../store/useMessageStore";
import { useThreadStore } from "../store/useThreadStore";

export function useClearChat() {
  const activeId = useThreadStore((s) => s.activeId);
  const clear = useMessageStore((s) => s.clear);
  return () => {
    if (activeId) clear(activeId);
  };
}
