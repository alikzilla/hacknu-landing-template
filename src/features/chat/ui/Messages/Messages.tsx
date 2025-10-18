// src/features/chat/ui/Messages/Messages.tsx
import { useEffect, useRef } from "react";
import { useMessageStore, useThreadStore, MessageType } from "../../model";
import { EMPTY_MESSAGES } from "../../model/constants/contants";
import { useChatHistoryLoader } from "../../model/hooks/useChatIo";

const Bubble = ({ m }: { m: MessageType }) => {
  const isUser = m.role === "user";
  const isTyping = !!m.typing;
  const isPending = !!m.pending;

  console.log(m);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 shadow-sm
        ${
          isUser
            ? "bg-emerald-600 text-white rounded-br-sm"
            : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
        }
        ${isPending ? "opacity-80" : ""}
        `}
      >
        {/* typing skeleton */}
        {isTyping ? (
          <div className="flex items-center gap-1 text-slate-500">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed md:text-base">
            {m.text}
            {m.error && (
              <div className="mt-1 text-[11px] text-red-600">
                Ошибка: {m.error}
              </div>
            )}
          </div>
        )}

        {m.files?.length ? (
          <div
            className={`mt-2 grid grid-cols-2 gap-2 ${
              isUser ? "text-white/90" : "text-slate-700"
            }`}
          >
            {m.files.map((f) => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                className="truncate rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs hover:underline"
              >
                {f.name}
              </a>
            ))}
          </div>
        ) : null}

        <div
          className={`mt-1 text-right text-[10px] ${
            isUser ? "text-white/80" : "text-slate-500"
          }`}
        >
          {m.time}
        </div>
      </div>
    </div>
  );
};

export const Messages = () => {
  const ref = useRef<HTMLDivElement>(null);
  const activeId = useThreadStore((s) => s.activeId);
  const list = useMessageStore((s) =>
    activeId ? s.byThread[activeId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES
  );

  const { load } = useChatHistoryLoader();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  });

  return (
    <div
      ref={ref}
      className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white px-3 md:px-4 py-3 md:py-4"
    >
      <div className="mx-auto max-w-3xl space-y-2.5 md:space-y-3">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 md:p-8 text-center text-slate-500">
            Начните диалог: опишите цель (например, «Квартира 70 млн ₸, доход
            500к»), прикрепите документы или продиктуйте голосом.
          </div>
        ) : (
          list.map((m) => <Bubble key={m.id} m={m} />)
        )}
      </div>
    </div>
  );
};
