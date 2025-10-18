import { useState, useCallback } from "react";
import { FilePreview } from "../types";

export function useFileQueue() {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const add = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));
    setFiles((p) => [...p, ...arr]);
  }, []);
  const clear = () => setFiles([]);
  const remove = (id: string) => setFiles((p) => p.filter((x) => x.id !== id));
  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) add(e.dataTransfer.files);
  };
  return { files, add, clear, remove, onDrop };
}
