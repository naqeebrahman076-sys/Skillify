'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

type ToastProps = {
  title: string
  description?: string
  onDismiss: () => void
}

export function Toast({ title, description, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 5000)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-4"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
