import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'
import { trackEvent } from '@/lib/clarity'
import iconPdf from '@/assets/icon-pdf.png'
import iconCsv from '@/assets/icon-csv.png'

const SHARE_URL = `${window.location.origin}/s/8a2hf6fi`

interface ShareDialogProps {
  onClose: () => void
  onCopy?: () => void
  onExportPdf?: () => void
  onExportCsv?: () => void
}

export function ShareDialog({ onClose, onCopy, onExportPdf, onExportCsv }: ShareDialogProps) {
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
    onCopy?.()
    trackEvent('copy_share_url', { url: SHARE_URL })
    setTimeout(() => setCopied(false), 2000)
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[300] bg-black/20" onClick={onClose} />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="fixed z-[301] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[491px] bg-card border border-border rounded-[10px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] size-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="size-3.5 text-foreground" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5 pr-6">
          <p className="font-sans font-semibold text-lg leading-none text-foreground">
            Share Submission View
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-5">
            Send a polished, read-only link for the selected submissions without exposing the management workspace.
          </p>
        </div>

        {/* URL input */}
        <div className="relative flex items-center h-9 px-3 pr-10 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <a
            href={SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-sans text-sm text-muted-foreground truncate min-w-0 hover:text-foreground hover:underline transition-colors"
          >
            {SHARE_URL}
          </a>
          <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
            <button
              onClick={handleCopy}
              className={cn(
                'absolute right-3 size-4 flex items-center justify-center transition-colors',
                copied ? 'text-green' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Copy className="size-4" />
            </button>
          </Tooltip>
        </div>

        {/* Download */}
        <div className="flex flex-col gap-4">
          <p className="font-sans font-semibold text-xs text-foreground">Download</p>
          <div className="flex items-center gap-4">
            {/* PDF */}
            <button
              onClick={onExportPdf}
              className="flex flex-col items-center gap-2.5"
            >
              <div className="size-12 flex items-center justify-center rounded-full bg-soft-red border border-soft-red-border">
                <img src={iconPdf} alt="PDF" className="size-6" />
              </div>
              <span className="font-sans font-semibold text-xs text-foreground">PDF</span>
            </button>

            {/* CSV */}
            <button
              onClick={onExportCsv}
              className="flex flex-col items-center gap-2.5"
            >
              <div className="size-12 flex items-center justify-center rounded-full bg-soft-green border border-soft-green-border">
                <img src={iconCsv} alt="CSV" className="size-6" />
              </div>
              <span className="font-sans font-semibold text-xs text-foreground">CSV</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
