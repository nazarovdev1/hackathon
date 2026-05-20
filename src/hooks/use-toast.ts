"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  toast: (input: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast: Toast = { ...input, id, duration: input.duration ?? 4000 };
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => dismiss(id), newToast.duration);
      }
    },
    [dismiss],
  );

  const success = useCallback(
    (title: string, description?: string) => toast({ type: "success", title, description }),
    [toast],
  );

  const error = useCallback(
    (title: string, description?: string) => toast({ type: "error", title, description, duration: 6000 }),
    [toast],
  );

  const info = useCallback(
    (title: string, description?: string) => toast({ type: "info", title, description }),
    [toast],
  );

  const warning = useCallback(
    (title: string, description?: string) => toast({ type: "warning", title, description, duration: 5000 }),
    [toast],
  );

  return { toasts, toast, dismiss, success, error, info, warning };
}
