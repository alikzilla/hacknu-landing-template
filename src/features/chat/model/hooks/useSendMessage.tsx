import { useMessageStore } from "../store/useMessageStore";
import { useThreadStore } from "../store/useThreadStore";
import { FilePreviewType } from "../types";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function useSendMessage() {
  const activeId = useThreadStore((s) => s.activeId);
  const updateMeta = useThreadStore((s) => s.updateMeta);
  const push = useMessageStore((s) => s.push);

  return (text: string, files?: FilePreviewType[]) => {
    if (!activeId) return;
    const msg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      text,
      files,
      time: now(),
    };
    push(activeId, msg);
    updateMeta(activeId, {
      lastMessage: text.slice(0, 80),
      updatedAt: Date.now(),
    });
  };
}

export function useAssistantReply() {
  const activeId = useThreadStore((s) => s.activeId);
  const push = useMessageStore((s) => s.push);

  return (text: string) => {
    if (!activeId) return;
    push(activeId, {
      id: crypto.randomUUID(),
      role: "assistant",
      text,
      time: now(),
    });
  };
}
