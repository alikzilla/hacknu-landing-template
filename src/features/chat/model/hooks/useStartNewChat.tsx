import { useMessageStore } from "../store/useMessageStore";
import { useThreadStore } from "../store/useThreadStore";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function useStartNewChat() {
  const add = useThreadStore((s) => s.add);
  const setActive = useThreadStore((s) => s.setActive);
  const push = useMessageStore((s) => s.push);

  return () => {
    const id = crypto.randomUUID();
    add({ id, title: "Новый диалог", updatedAt: Date.now() });
    setActive(id);
    push(id, {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Ассаляму алейкум! О какой цели поговорим?",
      time: now(),
    });
  };
}
