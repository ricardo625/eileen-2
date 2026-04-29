import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { ToastStack, type ToastItem } from '@/components/ui/Toast'

function NameDialog({ onContinue, onClose }: { onContinue: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="relative bg-card border border-border rounded-[10px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4 p-6 w-[491px]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] size-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="size-3.5 text-foreground" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5 pr-6">
          <p className="font-semibold text-lg leading-none text-foreground">
            Saint Viviana would like you to take a look
          </p>
          <p className="text-sm text-muted-foreground leading-5">
            Help to keep everyone aligned to input your name bellow
          </p>
        </div>

        {/* Input */}
        <input
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onContinue(name.trim())}
          placeholder="Enter your name"
          className="w-full h-9 px-3 rounded-full border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:ring-1 focus:ring-border"
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onContinue(name.trim())}
            className={cn(
              'h-9 px-4 rounded-lg bg-darker text-brighter text-sm font-medium shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] transition-opacity',
              name.trim() ? 'opacity-100 hover:opacity-80' : 'opacity-40 cursor-default',
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

const IMAGES = [
  'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556767576-cf0a4a80e5b8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526152505827-d2f3b5b4a52a?w=800&auto=format&fit=crop',
]

const INITIAL_ITEMS = [
  { id: 1, label: 'Additional SKU Found',      checked: true  },
  { id: 2, label: 'Behind Counter',            checked: true  },
  { id: 3, label: 'Restock Mango Bliss',       checked: true  },
  { id: 4, label: 'Fix Promotional Pricing',   checked: false },
  { id: 5, label: 'Behind Glass',              checked: false },
  { id: 6, label: 'Display Not Found',         checked: false },
  { id: 7, label: 'Locked Case — Request Key', checked: false },
]

export function SharedLinkPage() {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [_viewerName, setViewerName] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [nextId, setNextId] = useState(1)

  function dismissToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function handleAcknowledge() {
    if (acknowledged) return
    setAcknowledged(true)
    const id = nextId
    setNextId(n => n + 1)
    setToasts(prev => [...prev, {
      id,
      message: 'Acknowledged with success',
      onUndo: () => setAcknowledged(false),
    }])
  }

  function toggleItem(id: number) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {dialogOpen && (
        <NameDialog
          onContinue={name => { setViewerName(name); setDialogOpen(false) }}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {/* Decorative blur orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-80px',
          top: '400px',
          width: '553px',
          height: '553px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,185,175,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-[688px] flex flex-col gap-10">

          {/* Header */}
          <div className="relative flex flex-col gap-2 py-3.5">
            <h1 className="font-semibold text-xl leading-7 text-foreground">The Corner Market</h1>
            <p className="text-sm text-muted-foreground">2660 San Miguel Drive, Newport Beach, CA, US - 92660</p>
            <p className="text-xs text-muted-foreground leading-none">Apr 18, 2026, 02:31 PM PDT</p>

            <button
              onClick={handleAcknowledge}
              className={cn(
                'absolute right-0 top-0 flex items-center gap-2 h-9 px-4 rounded-lg bg-darker text-brighter font-medium text-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-opacity',
                acknowledged ? 'opacity-50 cursor-default' : 'opacity-100 hover:opacity-80',
              )}
            >
              <Check className="size-4" />
              Acknowledged
            </button>
          </div>

          {/* Image viewer */}
          <div className="flex flex-col">
            {/* Image counter */}
            <p className="text-xs text-white text-center leading-none mb-2 opacity-0 select-none" aria-hidden>
              {activeIdx + 1} of {IMAGES.length} images
            </p>

            {/* Main image */}
            <div className="relative rounded-lg overflow-hidden group" style={{ height: 356 }}>
              <img
                src={IMAGES[activeIdx]}
                alt="Store shelf"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
                <span className="text-xs text-white font-normal drop-shadow">
                  {activeIdx + 1} of {IMAGES.length} images
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-3 size-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/75 transition-colors"
              >
                <Maximize2 className="size-4" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 items-center pt-5 pb-1.5 pl-1">
              {IMAGES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={cn(
                    'relative shrink-0 size-12 rounded-lg overflow-hidden transition-all',
                    i === activeIdx
                      ? 'ring-2 ring-darker border-2 border-brighter'
                      : 'opacity-75 hover:opacity-100',
                  )}
                >
                  <img src={src} alt={`Thumb ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="flex flex-col gap-4">
            <h2 className="font-medium text-lg leading-none" style={{ color: '#141417' }}>Action Items</h2>
            <div className="flex flex-col">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    'flex items-center gap-3 h-11 px-4 py-3 text-left transition-colors hover:bg-accent rounded-sm overflow-hidden',
                    i < items.length - 1 && 'border-b border-border-alpha',
                  )}
                >
                  <div
                    className={cn(
                      'shrink-0 size-4 rounded-[4px] flex items-center justify-center transition-colors',
                      item.checked
                        ? 'bg-darker shadow-sm'
                        : 'border border-darker opacity-40',
                    )}
                  >
                    {item.checked && <Check className="size-3 text-brighter" />}
                  </div>
                  <span className="text-sm text-sidebar-foreground font-medium font-poppins">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-[400] bg-black/80 flex flex-col items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Counter — top center */}
          <p className="text-xs text-white font-normal select-none mb-4">
            {activeIdx + 1} of {IMAGES.length} images
          </p>

          {/* Image */}
          <img
            src={IMAGES[activeIdx]}
            alt="Store shelf"
            className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Prev — left side, vertically centered */}
          <button
            onClick={e => { e.stopPropagation(); setActiveIdx(i => (i - 1 + IMAGES.length) % IMAGES.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Next — right side, vertically centered */}
          <button
            onClick={e => { e.stopPropagation(); setActiveIdx(i => (i + 1) % IMAGES.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Close — top right */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>,
        document.body,
      )}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
