import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface ToastItem {
  id: number
  message: string
  onUndo?: () => void
}

interface ToastProps {
  item: ToastItem
  onDismiss: (id: number) => void
  duration?: number
}

export function Toast({ item, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), duration)
    return () => clearTimeout(t)
  }, [item.id, onDismiss, duration])

  return (
    <div className="w-[388px] animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="relative flex items-center gap-2 pl-4 pr-6 py-4 bg-card border border-border rounded-md shadow-[0px_4px_4px_0px_var(--shadow)] overflow-clip">
        <p className="flex-1 font-sans font-medium text-sm text-card-foreground opacity-90">
          {item.message}
        </p>
        {item.onUndo && (
          <button
            onClick={() => { item.onUndo!(); onDismiss(item.id) }}
            className="h-9 flex items-center justify-center px-4 border border-border-alpha rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] font-sans font-medium text-sm text-card-foreground hover:bg-accent transition-colors shrink-0"
          >
            Undo
          </button>
        )}
        <div
          className="absolute bottom-[-1px] left-[-1px] h-[4px] bg-darker"
          style={{ animation: `toast-progress ${duration}ms linear forwards, toast-pulse 1.2s ease-in-out infinite` }}
        />
      </div>
    </div>
  )
}

interface ToastStackProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
  duration?: number
}

export function ToastStack({ toasts, onDismiss, duration }: ToastStackProps) {
  if (!toasts.length) return null
  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end">
      {toasts.map(item => (
        <Toast key={item.id} item={item} onDismiss={onDismiss} duration={duration} />
      ))}
    </div>,
    document.body,
  )
}
