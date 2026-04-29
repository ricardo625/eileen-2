import { Archive, Check, ChevronsDown, ChevronLeft, ChevronRight, CircleDashed, FlagTriangleRight, Forward, Plus, Search, Trash2, XCircle } from 'lucide-react'
import { SignalBadge, type BadgeVariant } from '@/components/SignalBadge'
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

const STATUS_LABEL: Record<StatusType, string> = {
  good: 'Good Stock',
  low:  'Low Stock',
  none: 'No Stock',
  out:  'Out of Stock',
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

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563746924237-f81d1ab37df2?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&auto=format&fit=crop',
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
      image:     PRODUCT_IMAGES[idx],
      price:     `$${base.toFixed(2).replace('.', ',')}`,
      salePrice: `$${(base + delta).toFixed(2).replace('.', ',')}`,
      priceDown: delta < 0,
      inventory: 1 + ((n * (i + 1)) % 10),
      shelf:     1 + ((n + i * 2) % 12),
    }
  })
}

const SECTIONS = [
  { title: 'Action Items',         empty: 'No action items added.' },
  { title: 'Internal Store Notes', empty: 'No store notes added.' },
  { title: 'Account Management',   empty: 'No account management notes added.' },
]

const NOTE_OPTIONS: Record<string, string[]> = {
  'Account Management':   ['Direct Shop', 'Distributor', 'Grocery DC'],
  'Internal Store Notes': ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
  'Action Items':         ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
}

function initNotes(_s: SubmissionData | null | undefined): Record<string, string[]> {
  const noteOpts = NOTE_OPTIONS['Internal Store Notes']
  const actionOpts = NOTE_OPTIONS['Action Items']
  return {
    'Account Management':   [],
    'Internal Store Notes': [noteOpts[0], noteOpts[1], noteOpts[2]],
    'Action Items':         [actionOpts[3], actionOpts[4]],
  }
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
  const [sectionSearches, setSectionSearches] = useState<Record<string, string>>({})
  const [focusedSection, setFocusedSection]   = useState<string | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string[]>>(
    () => initNotes(submission)
  )
  const [deletedOptions, setDeletedOptions] = useState<Record<string, string[]>>({})
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [flagged, setFlagged]           = useState(submission?.badges.includes('flagged') ?? false)
  const [toasts, setToasts]             = useState<ToastItem[]>([])
  const [shareOpen, setShareOpen]       = useState(false)
  const searchInputRefs  = useRef<Record<string, HTMLInputElement | null>>({})

  // Reset per-card state when a different card is opened
  useEffect(() => {
    setFlagged(submission?.badges.includes('flagged') ?? false)
    setSelectedNotes(initNotes(submission))
    setDeletedOptions({})
    setSectionSearches({})
    setFocusedSection(null)
  }, [submission?.id])

  if (!open) return null

  const images   = Array.from({ length: Math.min(submission?.imageCount ?? 1, 5) }, () => submission?.image ?? '')
  const products = submission ? generateProducts(submission.id, submission.badges) : []

  const toggleNote = (section: string, note: string) => {
    const isAdding = !(selectedNotes[section] ?? []).includes(note)
    if (isAdding) trackEvent('select_tag_shelf_drawer', { card_id: cardId ?? null, tag_name: note, is_new: false })
    setSelectedNotes(prev => {
      const cur = prev[section] ?? []
      return { ...prev, [section]: cur.includes(note) ? cur.filter(n => n !== note) : [...cur, note] }
    })
  }

  const deleteItem = (section: string, note: string, isBase: boolean) => {
    setSelectedNotes(prev => ({ ...prev, [section]: (prev[section] ?? []).filter(n => n !== note) }))
    if (isBase) setDeletedOptions(prev => ({ ...prev, [section]: [...(prev[section] ?? []), note] }))
  }


  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[640px] bg-card z-50 shadow-2xl animate-in slide-in-from-right duration-300 ease-out flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-parent flex flex-col gap-6 pb-6">

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

            {/* Signal tags */}
            {submission?.badges && submission.badges.length > 0 && (
              <div className="absolute right-[19px] top-[14px] flex items-center gap-1.5">
                {(submission.badges as BadgeVariant[])
                  .map(b => <SignalBadge key={b} variant={b} />)
                }
              </div>
            )}
          </div>

          {/* Info sections */}
          <div className="flex flex-col">
            {SECTIONS.map(({ title }) => {
              const tags     = selectedNotes[title] ?? []
              const search   = sectionSearches[title] ?? ''
              const baseOpts = NOTE_OPTIONS[title] ?? []
              const deleted  = deletedOptions[title] ?? []
              const visibleBase = baseOpts.filter(n => !deleted.includes(n))
              const customOpts = tags.filter(t => !baseOpts.includes(t))
              const allOpts  = [...visibleBase, ...customOpts]
              // Dropdown: suggestions from base options filtered by search
              const suggestions = search
                ? visibleBase.filter(n => n.toLowerCase().includes(search.toLowerCase()))
                : []
              const isDropdownOpen = focusedSection === title && search.length > 0
              const exactMatch = allOpts.some(n => n.toLowerCase() === search.toLowerCase())

              const commitSearch = () => {
                const name = search.trim()
                if (!name) return
                if (exactMatch) {
                  const match = allOpts.find(n => n.toLowerCase() === name.toLowerCase())!
                  toggleNote(title, match)
                } else {
                  trackEvent('select_tag_shelf_drawer', { card_id: cardId ?? null, tag_name: name, is_new: true })
                  setSelectedNotes(prev => ({ ...prev, [title]: [...(prev[title] ?? []), name] }))
                }
                setSectionSearches(prev => ({ ...prev, [title]: '' }))
                setFocusedSection(null)
              }

              return (
                <div key={title} className="flex flex-col gap-0">
                  {/* Title row */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-2.5">
                    <span className="font-sans font-medium text-lg text-foreground leading-none">{title}</span>
                  </div>

                  {/* Inline search + dropdown */}
                  <div className="relative mx-6">
                    <div className={cn(
                      'flex items-center gap-2.5 py-2 border-b transition-colors',
                      focusedSection === title ? 'border-[#eb978a]' : 'border-border',
                    )}>
                      <Search className="size-5 text-muted-foreground shrink-0" />
                      <input
                        ref={el => { searchInputRefs.current[title] = el }}
                        type="text"
                        value={search}
                        onChange={e => setSectionSearches(prev => ({ ...prev, [title]: e.target.value }))}
                        onFocus={() => setFocusedSection(title)}
                        onBlur={() => setTimeout(() => setFocusedSection(null), 150)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); commitSearch() }
                          if (e.key === 'Escape') { setSectionSearches(prev => ({ ...prev, [title]: '' })); setFocusedSection(null) }
                        }}
                        placeholder={`Search ${title.toLowerCase()}`}
                        className="flex-1 text-base bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Suggestions dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-[0px_4px_28px_0px_var(--shadow)] z-[60] overflow-hidden flex flex-col">
                        {suggestions.map(note => {
                          const checked = tags.includes(note)
                          const isActionItems = title === 'Action Items'
                          return (
                            <button
                              key={note}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => { toggleNote(title, note); setSectionSearches(prev => ({ ...prev, [title]: '' })) }}
                              className="flex items-center gap-3 h-10 px-4 hover:bg-accent transition-colors text-left"
                            >
                              {isActionItems && (
                                <div className={cn(
                                  'size-4 rounded-[4px] shrink-0 flex items-center justify-center',
                                  checked
                                    ? 'bg-darker shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]'
                                    : 'border border-dashed border-darker/20',
                                )}>
                                  {checked && <Check className="size-2.5 text-background stroke-[2.5]" />}
                                </div>
                              )}
                              <span className="flex-1 font-poppins font-medium text-sm text-sidebar-foreground leading-5 truncate">{note}</span>
                            </button>
                          )
                        })}
                        {!exactMatch && (
                          <button
                            onMouseDown={e => e.preventDefault()}
                            onClick={commitSearch}
                            className="flex items-center gap-3 h-10 px-4 hover:bg-accent transition-colors text-left border-t border-border"
                          >
                            <Plus className="size-4 text-muted-foreground shrink-0" />
                            <span className="font-poppins font-medium text-sm text-muted-foreground leading-5">Add "{search}"</span>
                          </button>
                        )}
                        {suggestions.length === 0 && exactMatch && (
                          <span className="px-4 py-2.5 text-sm text-muted-foreground font-sans">Press Enter to toggle</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* List */}
                  <div className="flex flex-col pb-2">
                    {tags.map(note => {
                      const isActionItems = title === 'Action Items'
                      return isActionItems ? (
                        <button
                          key={note}
                          onClick={() => toggleNote(title, note)}
                          className="group/row flex items-center gap-3 h-11 px-6 border-b border-border-alpha overflow-hidden hover:bg-accent transition-colors text-left"
                        >
                          <div className="size-4 rounded-[4px] shrink-0 flex items-center justify-center bg-darker shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
                            <Check className="size-2.5 text-background stroke-[2.5]" />
                          </div>
                          <span className="flex-1 font-poppins font-medium text-sm text-sidebar-foreground leading-5 truncate">{note}</span>
                          <span
                            role="button"
                            onClick={e => { e.stopPropagation(); deleteItem(title, note, baseOpts.includes(note)) }}
                            className="size-4 flex items-center justify-center opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity shrink-0"
                          >
                            <Trash2 className="size-4 text-muted-foreground" />
                          </span>
                        </button>
                      ) : (
                        <div
                          key={note}
                          className="group/row flex items-center gap-3 h-11 px-6 border-b border-border-alpha overflow-hidden hover:bg-accent transition-colors"
                        >
                          <span className="flex-1 font-poppins font-medium text-sm text-sidebar-foreground leading-5 truncate">{note}</span>
                          <span
                            role="button"
                            onClick={() => deleteItem(title, note, baseOpts.includes(note))}
                            className="size-4 flex items-center justify-center opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity shrink-0"
                          >
                            <Trash2 className="size-4 text-muted-foreground" />
                          </span>
                        </div>
                      )
                    })}
                    {tags.length === 0 && (
                      <span className="px-6 py-3 font-sans text-sm text-muted-foreground">No items added.</span>
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
              <span className="w-[220px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Item</span>
              <span className="w-[81px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Price</span>
              <span className="w-[104px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Sale Price</span>
              <span className="w-[86px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Inventory</span>
              <span className="font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Shelf Height</span>
            </div>
            {products.map((p, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-6 px-6 py-7 border-border-alpha border-l border-r border-t',
                  i === products.length - 1 && 'border-b',
                )}
              >
                <div className="w-[67px] shrink-0">
                  <Tooltip label={STATUS_LABEL[p.status]}>
                    <span className="inline-flex">{STATUS_ICON[p.status]}</span>
                  </Tooltip>
                </div>
                <div className="w-[220px] flex items-center gap-2 shrink-0 min-w-0">
                  <img src={p.image} alt={p.name} className="size-[31px] rounded object-cover shrink-0" />
                  <span className="font-sans font-medium text-sm text-muted-foreground leading-none">{p.name}</span>
                </div>
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

      </div>{/* end scrollable */}

      {/* Sticky bottom bar */}
      <div className="shrink-0 flex items-center gap-[17px] px-4 py-4 bg-card border-t border-border shadow-[0px_-7px_7.5px_0px_var(--shadow)]">
        {/* Archive */}
        <button
          onClick={() => { onArchive?.(); onClose() }}
          className="size-12 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors shrink-0"
        >
          <Archive className="size-4 text-foreground" />
        </button>

        {/* Flag */}
        <button
          onClick={() => setFlagged(f => !f)}
          className={cn(
            'size-12 flex items-center justify-center rounded-full border transition-colors shrink-0',
            flagged
              ? 'bg-gradient-to-r from-soft-red to-brighter border-soft-red-border'
              : 'border-border hover:bg-accent',
          )}
        >
          <FlagTriangleRight className={cn('size-4 transition-colors', flagged ? 'text-[var(--red)]' : 'text-foreground')} />
        </button>

        {/* Share */}
        <button
          onClick={() => setShareOpen(true)}
          className="flex-1 h-[52px] flex items-center justify-center gap-2 bg-[#121217] border border-[rgba(35,31,32,0.32)] rounded-full hover:opacity-90 transition-opacity"
        >
          <Forward className="size-5 text-white" />
          <span className="font-semibold text-[15px] text-white">Share</span>
        </button>
      </div>

      </div>{/* end drawer */}

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
