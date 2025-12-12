import { useState, useEffect } from "react";

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
};

let toasts: Toast[] = [];
const listeners = new Set<(t: Toast[]) => void>();

function notify() {
  listeners.forEach((cb) => cb([...toasts]));
}

export const toast = {
  push(toastProps: Omit<Toast, "id">) {
    const id = Math.random().toString(36).slice(2, 9);
    const t: Toast = { id, ...toastProps };
    toasts = [t, ...toasts];
    notify();

    const duration = toastProps.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        toasts = toasts.filter((x) => x.id !== id);
        notify();
      }, duration);
    }

    return id;
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export function useToast() {
  const [local, setLocal] = useState<Toast[]>(toasts);

  useEffect(() => {
    const cb = (next: Toast[]) => setLocal(next);
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);

  return { toasts: local, toast };
}

export default useToast;
