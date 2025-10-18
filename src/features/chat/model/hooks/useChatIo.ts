// src/features/chat/model/hooks/useChatIO.ts
import { useCallback, useState } from "react";
import { ChatService } from "@/features/chat/request/requests";
import { useMessageStore } from "../store/useMessageStore";
import { useThreadStore } from "../store/useThreadStore";
import { FilePreviewType, MessageType } from "../types";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Normalize backend message dto -> MessageType */
function dtoToMsg(dto: {
  role: string;
  content: string;
  createdAt?: string;
  id?: string;
}): MessageType {
  return {
    id: dto.id ?? crypto.randomUUID(),
    role: (dto.role as MessageType["role"]) ?? "assistant",
    text: dto.content ?? "",
    time: dto.createdAt
      ? new Date(dto.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : now(),
  };
}

export function useChatHistoryLoader() {
  const activeId = useThreadStore((s) => s.activeId);
  const setForThread = useMessageStore((s) => s.setForThread);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeId) return;
    try {
      setLoading(true);
      setErr(null);
      const res = await ChatService.getChat(activeId);
      const msgs = (res.data.messages ?? []).map(dtoToMsg);
      setForThread(activeId, msgs);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [activeId, setForThread]);

  return { load, loading, error };
}

export function useChatIO() {
  const activeId = useThreadStore((s) => s.activeId);
  const updateMeta = useThreadStore((s) => s.updateMeta);
  const { push, updateById, removeById, setForThread } = useMessageStore();
  const [sending, setSending] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const send = useCallback(
    async (text: string, files?: FilePreviewType[]) => {
      if (!activeId) return;
      if (!text && (!files || files.length === 0)) return;

      // 1) optimistic user message
      const userId = crypto.randomUUID();
      const userMsg: MessageType = {
        id: userId,
        role: "user",
        text,
        files,
        time: now(),
        pending: true,
      };
      push(activeId, userMsg);

      // 2) update sidebar meta
      updateMeta(activeId, {
        lastMessage: text.slice(0, 80),
        updatedAt: Date.now(),
      });

      // 3) show typing placeholder
      const typingId = crypto.randomUUID();
      const typingMsg: MessageType = {
        id: typingId,
        role: "assistant",
        text: "Печатает…",
        time: now(),
        typing: true,
      };
      push(activeId, typingMsg);

      // 4) call API
      setSending(true);
      setErr(null);
      try {
        // if you need to reflect files now (no upload endpoint), append hint:
        const payload = {
          content:
            text +
            (files?.length ? `\n\n[attached: ${files.length} file(s)]` : ""),
        };
        await ChatService.sendPrompt(activeId, payload);

        // Option A: re-fetch the whole thread (robust if server composes messages)
        const res = await ChatService.getChat(activeId);

        console.log(res);

        const msgs = (res.data.messages ?? []).map(dtoToMsg);
        setForThread(activeId, msgs);

        // Option B (if sendPrompt returns assistant text): replace typing with that text
        // updateById(activeId, typingId, { text: serverText, typing: false });
      } catch (e: any) {
        // mark user message as failed and remove typing
        updateById(activeId, userId, {
          pending: false,
          error: e?.message ?? "Ошибка отправки",
        });
        removeById(activeId, typingId);
        setErr(e?.message ?? "Не удалось отправить сообщение");
        return;
      } finally {
        setSending(false);
      }

      // 5) clear flags
      updateById(activeId, userId, { pending: false });
    },
    [activeId, push, setForThread, updateMeta, updateById, removeById]
  );

  return { send, sending, error };
}
