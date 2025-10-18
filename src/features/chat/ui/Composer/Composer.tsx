// src/features/chat/ui/Composer/Composer.tsx
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Paperclip,
  Microphone,
  PaperPlaneTilt,
  Trash,
  X,
} from "phosphor-react";
import { useFileQueue, FilePreviewType } from "../../model";
import { useChatIO } from "../../model/hooks/useChatIo";

export const Composer = () => {
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { files, add, clear, remove, onDrop } = useFileQueue();
  const { send, sending, error } = useChatIO();

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) add(e.target.files);
    e.target.value = "";
  };

  const doSend = () => {
    const text = input.trim();
    if (!text && files.length === 0) return;
    void send(text, files as FilePreviewType[]);
    setInput("");
    clear();
    taRef.current?.focus();
  };

  return (
    <>
      {/* attachments bar */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="border-t border-slate-200/80 bg-slate-50/70"
          >
            <div className="mx-auto max-w-3xl px-3 md:px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-600">
                  Прикреплено: {files.length} файл(ов)
                </div>
                <button
                  className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-white"
                  onClick={clear}
                >
                  <Trash size={14} /> Очистить
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-800">
                        {f.name}
                      </div>
                      <div className="text-slate-500">
                        {(f.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                      onClick={() => remove(f.id)}
                      aria-label="Удалить файл"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* sticky composer */}
      <div
        className="sticky bottom-0 border-t border-slate-200/80 bg-white"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
      >
        <div
          className="mx-auto flex max-w-3xl items-start gap-2 px-3 md:px-4 py-2.5 md:py-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {/* attach */}
          <label
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98] ${
              sending ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Paperclip size={18} />
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handlePick}
            />
          </label>

          {/* input */}
          <div className="relative flex-1 flex items-center gap-2">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              disabled={sending}
              placeholder={sending ? "Отправка…" : "Напишите сообщение…"}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 md:px-4 py-2 pr-24 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 text-[15px] disabled:opacity-70"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  doSend();
                }
              }}
            />

            {/* right actions */}
            <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2">
              <button
                disabled={sending}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
                title="Голосовой ввод"
              >
                <Microphone size={16} />
              </button>
              <button
                onClick={doSend}
                disabled={sending}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
                title="Отправить"
              >
                {sending ? (
                  <LoaderDots small />
                ) : (
                  <PaperPlaneTilt size={16} weight="bold" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* helper row */}
        <div className="mx-auto max-w-3xl px-3 md:px-4 pb-2 text-[11px] text-slate-500">
          {error ? (
            <span className="text-red-600">
              Ошибка: {error}.{" "}
              <button onClick={doSend} className="underline">
                Повторить
              </button>
            </span>
          ) : (
            <>
              Не присылайте конфиденциальные данные. Халяль-подход: без рибы,
              прозрачно и этично.
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* tiny inline loader */
function LoaderDots({ small }: { small?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1 ${small ? "scale-90" : ""}`}
      aria-label="Loading"
    >
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
    </div>
  );
}
