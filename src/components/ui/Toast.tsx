import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ToastProps {
  message: string
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [onDismiss, duration])

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center gap-2 pl-4 pr-6 py-4 bg-card border border-border rounded-md shadow-[0px_4px_4px_0px_var(--shadow)]">
        <p className="flex-1 font-sans font-medium text-sm text-card-foreground opacity-90 whitespace-nowrap">
          {message}
        </p>
        <button
          onClick={onDismiss}
          className="h-9 flex items-center justify-center px-4 border border-black/5 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] font-sans font-medium text-sm text-card-foreground hover:bg-accent transition-colors shrink-0"
        >
          Undo
        </button>
      </div>
    </div>,
    document.body,
  )
}
