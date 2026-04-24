import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SHARE_URL = 'https://foundey.app.shopwitheileen.com/s/8a2hf6fi'

interface ShareDialogProps {
  onClose: () => void
}

export function ShareDialog({ onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleCopy() {
    navigator.clipboard.writeText(SHARE_URL).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/20"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="fixed z-[301] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[491px] bg-card border border-border rounded-lg shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-5 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="size-4 text-foreground" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <p className="font-sans font-semibold text-lg leading-none text-foreground">
            Share Submission View
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-5">
            Send a polished, read-only link for the selected submissions without exposing the management workspace.
          </p>
        </div>

        {/* URL input */}
        <div className="relative flex items-center h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <span className="flex-1 font-sans text-sm text-muted-foreground truncate pr-8">
            {SHARE_URL}
          </span>
          <button
            onClick={handleCopy}
            className={cn(
              'absolute right-3 size-5 flex items-center justify-center transition-colors',
              copied ? 'text-green' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Copy className="size-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="h-9 flex items-center justify-center px-4 bg-background border border-input rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] font-sans font-medium text-sm text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}
