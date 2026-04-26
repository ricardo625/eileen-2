import { Archive, Check, ChevronsDown, ChevronLeft, ChevronRight, CircleDashed, FileDown, FlagTriangleRight, Forward, Link, Plus, Search, Sheet, X, XCircle } from 'lucide-react'
import { ToastStack, type ToastItem } from '@/components/ui/Toast'
import { ShareDialog } from '@/components/ShareDialog'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/clarity'
import { useState, useRef, useEffect } from 'react'

const imgExpandIcon = 'https://www.figma.com/api/mcp/asset/140f4632-f821-42e0-a60a-5279e7fbc00e'

type StatusType = 'good' | 'low' | 'none' | 'out'

const STATUS_ICON: Record<StatusType, React.ReactNode> = {
  good: <Check        className="size-4 text-green shrink-0" />,
  low:  <ChevronsDown className="size-4 text-[var(--amber,#ffb900)] shrink-0" />,
  none: <XCircle      className="size-4 text-[var(--red,#f91616)] shrink-0" />,
  out:  <CircleDashed className="size-4 text-muted-foreground shrink-0" />,
}

const PRODUCT_POOL = [
  'Mango Bliss - Glass Bottles',
  'Tropical Punch - Plastic Jugs',
  'Berry Fizz - Aluminum Cans',
  'Coconut Wave - Tetrapaks',
  'Orange Crush - PET Bottles',
  'Lemon Zest - Glass Jars',
  'Grape Delight - Cartons',
  'Pineapple Rush - Aluminum Cans',
  'Strawberry Dream - Tetrapaks',
  'Watermelon Splash - PET Bottles',
]

function generateProducts(id: string, badges: string[]) {
  const n = parseInt(id)
  const count = 3 + (n % 3)
  const hasNoStock  = badges.includes('no-stock')
  const hasLowStock = badges.includes('low-stock')
  return Array.from({ length: count }, (_, i) => {
    const idx = (n + i) % PRODUCT_POOL.length
    let status: StatusType = 'good'
    if      (i === 0 && hasNoStock)  status = 'out'
    else if (i === 0 && hasLowStock) status = 'low'
    else if (i === 1 && hasLowStock) status = 'low'
    else if ((n + i) % 7 === 0)      status = 'none'
    else if ((n + i) % 4 === 0)      status = 'low'
    const base  = 10 + ((n * (i + 1) * 3) % 20)
    const delta = (n + i) % 2 === 0 ? 3 : -2
    return {
      status,
      name:      PRODUCT_POOL[idx],
      price:     `$${base.toFixed(2).replace('.', ',')}`,
      salePrice: `$${(base + delta).toFixed(2).replace('.', ',')}`,
      priceDown: delta < 0,
      inventory: 1 + ((n * (i + 1)) % 10),
      shelf:     1 + ((n + i * 2) % 12),
    }
  })
}

const SECTIONS = [
  { title: 'Account Management',   empty: 'No account management notes added.' },
  { title: 'Internal Store Notes', empty: 'No store notes added.' },
  { title: 'Action Items',         empty: 'No action items added.' },
]

const NOTE_OPTIONS: Record<string, string[]> = {
  'Account Management':   ['Direct Shop', 'Distributor', 'Grocery DC'],
  'Internal Store Notes': ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
  'Action Items':         ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
}

function initNotes(s: SubmissionData | null | undefined): Record<string, string[]> {
  const empty = { 'Account Management': [], 'Internal Store Notes': [], 'Action Items': [] }
  if (!s) return empty
  const n = parseInt(s.id)
  const accOpts  = NOTE_OPTIONS['Account Management']
  const noteOpts = NOTE_OPTIONS['Internal Store Notes']
  const accMgr   = [accOpts[(n - 1) % accOpts.length]]
  const storeNotes: string[] = []
  if (s.noteCount && s.noteCount > 0) {
    const i = n - 1
    storeNotes.push(noteOpts[i % noteOpts.length])
    if (s.noteCount > 1) storeNotes.push(noteOpts[(i + 2) % noteOpts.length])
    if (s.noteCount > 3) storeNotes.push(noteOpts[(i + 4) % noteOpts.length])
  }
  const actionItems: string[] = []
  if (s.badges.includes('flagged') && s.noteCount && s.noteCount > 2) {
    actionItems.push(noteOpts[(n + 3) % noteOpts.length])
  }
  return { 'Account Management': accMgr, 'Internal Store Notes': storeNotes, 'Action Items': actionItems }
}

export interface SubmissionData {
  id: string
  storeName: string
  address: string
  image: string
  badges: string[]
  completedAt?: string
  completedBy?: string
  imageCount?: number
  noteCount?: number
}

interface Props {
  open: boolean
  onClose: () => void
  onArchive?: () => void
  cardId?: string | null
  submission?: SubmissionData | null
}

export function SubmissionDrawer({ open, onClose, onArchive, cardId, submission }: Props) {
  const [openSection, setOpenSection]   = useState<string | null>(null)
  const [noteSearch, setNoteSearch]     = useState('')
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string[]>>(
    () => initNotes(submission)
  )
  const [creatingNote, setCreatingNote] = useState(false)
  const [newNoteName, setNewNoteName]   = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [flagged, setFlagged]           = useState(submission?.badges.includes('flagged') ?? false)
  const [sendOpen, setSendOpen]         = useState(false)
  const [toasts, setToasts]             = useState<ToastItem[]>([])
  const [shareOpen, setShareOpen]       = useState(false)
  const sendBtnRef       = useRef<HTMLButtonElement>(null)
  const sendDropdownRef  = useRef<HTMLDivElement>(null)
  const sectionRefs      = useRef<Map<string, HTMLDivElement>>(new Map())

  // Reset per-card state when a different card is opened
  useEffect(() => {
    setFlagged(submission?.badges.includes('flagged') ?? false)
    setSelectedNotes(initNotes(submission))
  }, [submission?.id])

  useEffect(() => {
    if (!openSection) return
    function handleClick(e: MouseEvent) {
      const ref = sectionRefs.current.get(openSection!)
      if (ref && !ref.contains(e.target as Node)) {
        setOpenSection(null)
        setNoteSearch('')
        setCreatingNote(false)
        setNewNoteName('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openSection])

  useEffect(() => {
    if (!sendOpen) return
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (
        sendDropdownRef.current && !sendDropdownRef.current.contains(t) &&
        sendBtnRef.current && !sendBtnRef.current.contains(t)
      ) setSendOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [sendOpen])

  if (!open) return null

  const images   = Array.from({ length: Math.min(submission?.imageCount ?? 1, 5) }, () => submission?.image ?? '')
  const products = submission ? generateProducts(submission.id, submission.badges) : []

  const sectionOptions = openSection ? (NOTE_OPTIONS[openSection] ?? []) : []
  const filteredNotes  = sectionOptions.filter(n => n.toLowerCase().includes(noteSearch.toLowerCase()))

  const toggleNote = (section: string, note: string) => {
    const isAdding = !(selectedNotes[section] ?? []).includes(note)
    if (isAdding) trackEvent('select_tag_shelf_drawer', { card_id: cardId ?? null, tag_name: note, is_new: false })
    setSelectedNotes(prev => {
      const cur = prev[section] ?? []
      return { ...prev, [section]: cur.includes(note) ? cur.filter(n => n !== note) : [...cur, note] }
    })
  }

  const removeNote = (section: string, note: string) =>
    setSelectedNotes(prev => ({ ...prev, [section]: (prev[section] ?? []).filter(n => n !== note) }))

  const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
    'Account Management':   { bg: 'from-soft-rose to-brighter',  text: 'text-soft-rose-foreground' },
    'Internal Store Notes': { bg: 'from-soft-indigo to-brighter', text: 'text-soft-indigo-foreground' },
    'Action Items':         { bg: 'from-soft-lime to-brighter',   text: 'text-soft-lime-foreground' },
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[640px] bg-card z-50 overflow-y-auto overflow-x-hidden scroll-parent shadow-2xl animate-in slide-in-from-right duration-300 ease-out flex flex-col gap-6 pb-6">

        {/* Hero image */}
        <div className="relative shrink-0">
          <div className="h-[360px] w-full overflow-hidden">
            <img src={submission?.image} alt={submission?.storeName} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
            className="absolute top-3 right-3 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <img src={imgExpandIcon} alt="Expand" className="size-4" />
          </button>

          {/* Thumbnails */}
          <div className="flex gap-2.5 items-center px-4 pt-5 pb-2">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                className={cn(
                  'relative rounded-md shrink-0 size-12',
                  i === lightboxIndex && 'border-2 border-brighter shadow-[0px_0px_0px_2px_var(--darker)]',
                )}
              >
                <img src={src} alt="" className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>
        </div>

        {/* Panel header + Info sections */}
        <div className="flex flex-col shrink-0">
          <div className="relative px-6 py-3.5 flex flex-col gap-2 shrink-0">
            <span className="font-sans font-semibold text-xl leading-7 text-foreground">
              {submission?.storeName ?? '—'}
            </span>
            <span className="font-sans text-sm text-muted-foreground">
              {submission?.address ?? '—'}
            </span>
            {submission?.completedAt && (
              <div className="flex items-center gap-1">
                <span className="font-sans text-xs text-muted-foreground leading-none">
                  Completed {submission.completedAt} by
                </span>
                <div className="size-4 rounded-full bg-[#ffb31f] flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-semibold text-white leading-none">
                    {submission.completedBy?.[0]}
                  </span>
                </div>
                <span className="font-sans text-xs text-muted-foreground leading-none">
                  {submission.completedBy}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute right-6 top-3.5 flex items-center gap-2">
              <Tooltip label="Flag">
                <button
                  onClick={() => setFlagged(f => !f)}
                  className={cn(
                    'size-9 flex items-center justify-center rounded-full transition-colors',
                    flagged ? 'bg-gradient-to-r from-soft-red to-brighter' : 'hover:bg-accent',
                  )}
                >
                  <FlagTriangleRight className={cn('size-4 transition-colors', flagged ? 'text-[#f91616]' : 'text-foreground')} />
                </button>
              </Tooltip>
              <Tooltip label="Archive">
                <button
                  onClick={() => { onArchive?.(); onClose() }}
                  className="size-9 flex items-center justify-center rounded-full bg-secondary hover:bg-accent transition-colors"
                >
                  <Archive className="size-4 text-foreground" />
                </button>
              </Tooltip>
              <div className="relative">
                <Tooltip label="Send">
                  <button
                    ref={sendBtnRef}
                    onClick={() => setSendOpen(o => !o)}
                    className="size-9 flex items-center justify-center rounded-full bg-secondary hover:bg-accent transition-colors"
                  >
                    <Forward className="size-4 text-foreground" />
                  </button>
                </Tooltip>
                {sendOpen && (
                  <div
                    ref={sendDropdownRef}
                    className="absolute right-0 top-full mt-2 w-[180px] bg-card border border-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-[70] flex flex-col"
                  >
                    {[
                      { label: 'Export to PDF', Icon: FileDown, toast: 'Exported to PDF successfully' },
                      { label: 'Export to CSV', Icon: Sheet,    toast: 'Exported to CSV successfully' },
                      { label: 'Share URL',     Icon: Link,     toast: null },
                    ].map(({ label, Icon, toast: msg }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setSendOpen(false)
                          if (msg) setToasts(prev => [...prev, { id: Date.now() + Math.random(), message: msg }])
                          if (label === 'Share URL') setShareOpen(true)
                        }}
                        className="flex items-center gap-3 h-11 px-4 rounded-xl hover:bg-accent transition-colors text-left w-full"
                      >
                        <Icon className="size-4 text-muted-foreground shrink-0" />
                        <span className="font-poppins font-medium text-sm text-foreground">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info sections */}
          <div className="flex flex-col">
            {SECTIONS.map(({ title, empty }) => {
              const tags  = selectedNotes[title] ?? []
              const badge = BADGE_STYLE[title] ?? BADGE_STYLE['Internal Store Notes']
              return (
                <div key={title} className="flex items-center justify-between gap-4 px-6 py-5 border-b border-dashed border-border">
                  <div className="flex flex-col gap-2.5 min-w-0">
                    <span className="font-sans font-medium text-lg text-foreground leading-none">{title}</span>
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className={cn(
                              'inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-gradient-to-r text-xs font-semibold font-sans whitespace-nowrap',
                              badge.bg, badge.text,
                            )}
                          >
                            {tag}
                            <button
                              onClick={() => removeNote(title, tag)}
                              className="size-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity shrink-0"
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-muted-foreground">{empty}</span>
                    )}
                  </div>

                  {/* + button with dropdown */}
                  <div
                    className="relative shrink-0"
                    ref={el => {
                      if (el) sectionRefs.current.set(title, el)
                      else sectionRefs.current.delete(title)
                    }}
                  >
                    <Tooltip label={`Add ${title}`}>
                      <button
                        className="size-9 flex items-center justify-center rounded-full bg-background border border-input shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-accent transition-colors"
                        onClick={() => {
                          const isOpening = openSection !== title
                          if (isOpening) trackEvent('click_add_tag_shelf_drawer', { card_id: cardId ?? null, existing_tags_count: tags.length, source: 'drawer' })
                          setOpenSection(openSection === title ? null : title)
                          setNoteSearch('')
                          setCreatingNote(false)
                          setNewNoteName('')
                        }}
                      >
                        <Plus className="size-4 text-foreground" />
                      </button>
                    </Tooltip>

                    {openSection === title && (
                      <div className="absolute right-0 bottom-full mb-2 w-[258px] bg-background border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-[60] flex flex-col overflow-hidden">
                        <div className="p-2 pb-0">
                          <div className="flex items-center gap-2 h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            <Search className="size-4 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              value={noteSearch}
                              onChange={e => setNoteSearch(e.target.value)}
                              placeholder="Search"
                              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          {!creatingNote && (
                            <button
                              onClick={() => setCreatingNote(true)}
                              className="w-full h-9 flex items-center justify-center px-3 bg-background border border-dashed border-input rounded-full text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              Create Custom Note
                            </button>
                          )}
                        </div>
                        {creatingNote && (
                          <form
                            onSubmit={e => {
                              e.preventDefault()
                              const name = newNoteName.trim()
                              if (name && openSection) {
                                trackEvent('select_tag_shelf_drawer', { card_id: cardId ?? null, tag_name: name, is_new: true })
                                setSelectedNotes(prev => ({ ...prev, [openSection]: [...(prev[openSection] ?? []), name] }))
                              }
                              setCreatingNote(false)
                              setNewNoteName('')
                            }}
                            className="flex items-center gap-3 h-11 px-4 border-b border-border-alpha shrink-0"
                          >
                            <div className="size-4 rounded-[4px] shrink-0 border border-darker/40" />
                            <input
                              type="text"
                              value={newNoteName}
                              onChange={e => setNewNoteName(e.target.value)}
                              placeholder="Note name..."
                              className="flex-1 font-poppins font-medium text-sm text-sidebar-foreground bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Escape') { setCreatingNote(false); setNewNoteName('') } }}
                            />
                          </form>
                        )}
                        <div className={cn(filteredNotes.length > 5 ? 'overflow-y-auto max-h-[220px] hover-scroll' : '', 'pr-3')}>
                          {filteredNotes.map(note => {
                            const checked = (selectedNotes[openSection!] ?? []).includes(note)
                            return (
                              <button
                                key={note}
                                className="w-full flex items-center gap-3 h-11 px-4 text-left hover:bg-accent transition-colors rounded-xl"
                                onClick={() => toggleNote(openSection!, note)}
                              >
                                <div className={cn(
                                  'size-4 rounded-[4px] shrink-0 flex items-center justify-center',
                                  checked ? 'bg-darker shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]' : 'border border-darker/40',
                                )}>
                                  {checked && <Check className="size-2.5 text-background stroke-[2.5]" />}
                                </div>
                                <span className="font-poppins font-medium text-sm text-sidebar-foreground leading-5 truncate">{note}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Product table */}
        <div className="overflow-x-auto shrink-0 child-scroll">
          <div className="flex flex-col min-w-max">
            <div className="flex items-center gap-6 px-6 py-5 bg-accent border border-border-alpha">
              <span className="w-[67px] font-sans font-medium text-sm text-foreground leading-none underline decoration-dotted underline-offset-4 shrink-0">Status</span>
              <span className="w-[140px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Item</span>
              <span className="w-[81px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Price</span>
              <span className="w-[104px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Sale Price</span>
              <span className="w-[86px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Inventory</span>
              <span className="font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Shelf Height</span>
            </div>
            {products.map((p, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-6 px-6 py-5 border-border-alpha border-l border-r border-t',
                  i === products.length - 1 && 'border-b',
                )}
              >
                <div className="w-[67px] shrink-0">{STATUS_ICON[p.status]}</div>
                <span className="w-[140px] font-sans font-medium text-sm text-muted-foreground leading-none truncate shrink-0">{p.name}</span>
                <span className="w-[81px] font-sans font-medium text-sm text-green leading-none shrink-0">{p.price}</span>
                <span className={cn('w-[104px] font-sans font-medium text-sm leading-none shrink-0', p.priceDown ? 'text-[var(--red,#f91616)]' : 'text-muted-foreground')}>
                  {p.salePrice}
                </span>
                <span className="w-[86px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">{p.inventory}</span>
                <span className="font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">{p.shelf}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/80" onClick={() => setLightboxOpen(false)} />
          <button
            onClick={() => setLightboxIndex(i => Math.max(0, i - 1))}
            className={cn(
              'fixed left-6 top-1/2 -translate-y-1/2 z-[70] size-10 rounded-full backdrop-blur-[3.6px] bg-black/60 flex items-center justify-center transition-opacity',
              lightboxIndex === 0 ? 'opacity-30 cursor-default' : 'hover:bg-black/80',
            )}
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <div className="fixed inset-0 z-[65] flex items-center justify-center pointer-events-none px-24">
            <div className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden pointer-events-auto">
              <img src={images[lightboxIndex]} alt="Store" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-[3.6px] bg-black/60 px-4 py-2 rounded-full">
                <span className="text-white text-xs font-normal">{lightboxIndex + 1} of {images.length} images</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLightboxIndex(i => Math.min(images.length - 1, i + 1))}
            className={cn(
              'fixed right-6 top-1/2 -translate-y-1/2 z-[70] size-10 rounded-full backdrop-blur-[3.6px] bg-black/60 flex items-center justify-center transition-opacity',
              lightboxIndex === images.length - 1 ? 'opacity-30 cursor-default' : 'hover:bg-black/80',
            )}
          >
            <ChevronRight className="size-6 text-white" />
          </button>
        </>
      )}

      <ToastStack toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} />}
    </>
  )
}
