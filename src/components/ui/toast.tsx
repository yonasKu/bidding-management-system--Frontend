"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

type Toast = {
  id: number
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 3000)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md border p-3 shadow bg-background ${
              t.variant === "destructive" ? "border-red-400" : "border-border"
            }`}
          >
            {t.title && <div className="text-sm font-medium">{t.title}</div>}
            {t.description && (
              <div className="text-sm text-muted-foreground">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
