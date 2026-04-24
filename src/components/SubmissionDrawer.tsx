import { Archive, Check, ChevronsDown, ChevronLeft, ChevronRight, CircleDashed, FileDown, FlagTriangleRight, Forward, Link, Plus, Search, Sheet, X, XCircle } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { ShareDialog } from '@/components/ShareDialog'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

const imgStore = 'https://www.figma.com/api/mcp/asset/ac384ba7-b735-44e4-bbe2-dcc285a54722'
const imgAvatar = 'https://www.figma.com/api/mcp/asset/bb75b55e-d9af-4425-861e-5cb999b6aed4'
const imgExpandIcon = 'https://www.figma.com/api/mcp/asset/140f4632-f821-42e0-a60a-5279e7fbc00e'

const IMAGES = [imgStore, imgStore, imgStore]

type StatusType = 'good' | 'low' | 'none' | 'out'

const STATUS_ICON: Record<StatusType, React.ReactNode> = {
  good: <Check        className="size-4 text-green shrink-0" />,
  low:  <ChevronsDown className="size-4 text-[var(--amber,#ffb900)] shrink-0" />,
  none: <XCircle      className="size-4 text-[var(--red,#f91616)] shrink-0" />,
  out:  <CircleDashed className="size-4 text-muted-foreground shrink-0" />,
}

const PRODUCTS = [
  { status: 'good' as StatusType, name: 'Mango Bliss - Glass Bottles',     price: '$14,49', salePrice: '$17,49', priceDown: false, inventory: 2,  shelf: 5  },
  { status: 'low'  as StatusType, name: 'Tropical Punch - Plastic Jugs',   price: '$12,99', salePrice: '$11,99', priceDown: true,  inventory: 3,  shelf: 6  },
  { status: 'none' as StatusType, name: 'Berry Fizz - Aluminum Cans',       price: '$18,50', salePrice: '$21,50', priceDown: false, inventory: 1,  shelf: 2  },
  { status: 'out'  as StatusType, name: 'Coconut Wave - Tetrapaks',         price: '$13,75', salePrice: '$16,75', priceDown: false, inventory: 5,  shelf: 10 },
]

const SECTIONS = [
  { title: 'Account Management', empty: 'No account management notes added.' },
  { title: 'Internal Store Notes', empty: 'No store notes added.' },
  { title: 'Action Items', empty: 'No action items added.' },
]

const NOTE_OPTIONS: Record<string, string[]> = {
  'Account Management': ['Direct Shop', 'Distributor', 'Grocery DC'],
  'Internal Store Notes': ['additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
  'Action Items': ['additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
}

interface Props {
  open: boolean
  onClose: () => void
}

export function SubmissionDrawer({ open, onClose }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [noteSearch, setNoteSearch] = useState('')
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string[]>>({
    'Account Management': [],
    'Internal Store Notes': ['additional SKU Found', 'Behind Counter'],
    'Action Items': [],
  })
  const [creatingNote, setCreatingNote] = useState(false)
  const [newNoteName, setNewNoteName] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [flagged, setFlagged] = useState(false)
  const [sendOpen, setSendOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const sendBtnRef = useRef<HTMLButtonElement>(null)
  const sendDropdownRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

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
      ) {
        setSendOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [sendOpen])

  if (!open) return null

  const sectionOptions = openSection ? (NOTE_OPTIONS[openSection] ?? []) : []
  const filteredNotes = sectionOptions.filter(n =>
    n.toLowerCase().includes(noteSearch.toLowerCase())
  )

  const toggleNote = (section: string, note: string) =>
    setSelectedNotes(prev => {
      const current = prev[section] ?? []
      return {
        ...prev,
        [section]: current.includes(note) ? current.filter(n => n !== note) : [...current, note],
      }
    })

  const removeNote = (section: string, note: string) =>
    setSelectedNotes(prev => ({
      ...prev,
      [section]: (prev[section] ?? []).filter(n => n !== note),
    }))

  const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
    'Account Management':  { bg: 'from-[#f7fee7] to-white', text: 'text-[#3f6212]' },
    'Internal Store Notes': { bg: 'from-[#eef2ff] to-white', text: 'text-[#1e1a4d]' },
    'Action Items':        { bg: 'from-[#eef2ff] to-white', text: 'text-[#1e1a4d]' },
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[640px] bg-card z-50 overflow-y-auto overflow-x-hidden shadow-2xl animate-in slide-in-from-right duration-300 ease-out flex flex-col gap-6">

        {/* Hero image */}
        <div className="relative shrink-0">
          <div className="h-[360px] w-full overflow-hidden">
            <img src={imgStore} alt="Store" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
            className="absolute top-3 right-3 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <img src={imgExpandIcon} alt="Expand" className="size-4" />
          </button>

          {/* Thumbnails */}
          <div className="flex gap-2.5 items-center px-4 pt-5 pb-2">
            {IMAGES.map((src, i) => (
              <button
                key={i}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                className={cn(
                  'relative rounded-md shrink-0 size-12',
                  i === 0 && 'border-2 border-brighter shadow-[0px_0px_0px_2px_var(--darker)]',
                )}
              >
                <img src={src} alt="" className="w-full h-full object-cover rounded-md" />
              </button>
            ))}
          </div>
        </div>

        {/* Panel header + Info sections (one block, gap-0 internally) */}
        <div className="flex flex-col shrink-0">
          <div className="relative px-6 py-3.5 flex flex-col gap-2 shrink-0">
            <span className="font-sans font-semibold text-xl leading-7 text-foreground">The Corner Market</span>
            <span className="font-sans text-sm text-muted-foreground">2660 San Miguel Drive, Newport Beach, CA, US - 92660</span>
            <div className="flex items-center gap-1">
              <span className="font-sans text-xs text-muted-foreground leading-none">Submitted Apr 18, 2026 by</span>
              <img src={imgAvatar} alt="" className="size-4 rounded-full" />
              <span className="font-sans text-xs text-muted-foreground leading-none">Jaqueline</span>
            </div>

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
                <button className="size-9 flex items-center justify-center rounded-full bg-secondary hover:bg-accent transition-colors">
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
                        onClick={() => { setSendOpen(false); if (msg) setToast(msg); if (label === 'Share URL') setShareOpen(true) }}
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
            const tags = selectedNotes[title] ?? []
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
                          'inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-black/5 bg-gradient-to-r text-xs font-semibold font-sans whitespace-nowrap',
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

                    {/* Search */}
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

                    {/* Create Custom Note */}
                    <div className="p-2">
                      {creatingNote ? null : (
                        <button
                          onClick={() => setCreatingNote(true)}
                          className="w-full h-9 flex items-center justify-center px-3 bg-background border border-dashed border-input rounded-full text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          Create Custom Note
                        </button>
                      )}
                    </div>

                    {/* Inline new note row */}
                    {creatingNote && (
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          const name = newNoteName.trim()
                          if (name && openSection) setSelectedNotes(prev => ({
                            ...prev,
                            [openSection]: [...(prev[openSection] ?? []), name],
                          }))
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
                          onKeyDown={e => {
                            if (e.key === 'Escape') {
                              setCreatingNote(false)
                              setNewNoteName('')
                            }
                          }}
                        />
                      </form>
                    )}

                    {/* Items list */}
                    <div className="overflow-y-auto max-h-[264px] pr-3">
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
                              checked
                                ? 'bg-darker shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]'
                                : 'border border-darker/40',
                            )}>
                              {checked && <Check className="size-2.5 text-background stroke-[2.5]" />}
                            </div>
                            <span className="font-poppins font-medium text-sm text-sidebar-foreground leading-5 truncate">{note}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Scroll handle */}
                    <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-[7px] h-[112px] bg-darker opacity-20 rounded-full pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          )})}
          </div>
        </div>

        {/* Product table */}
        <div className="overflow-x-auto shrink-0">
        <div className="flex flex-col min-w-max">
          {/* Table header */}
          <div className="flex items-center gap-6 px-6 py-5 bg-accent border border-border-alpha">
            <span className="w-[67px] font-sans font-medium text-sm text-foreground leading-none underline decoration-dotted underline-offset-4 shrink-0">Status</span>
            <span className="w-[140px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Item</span>
            <span className="w-[81px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Price</span>
            <span className="w-[104px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Sale Price</span>
            <span className="w-[86px] font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Inventory</span>
            <span className="font-sans font-medium text-sm text-muted-foreground leading-none shrink-0">Shelf Height</span>
          </div>

          {/* Rows */}
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-6 px-6 py-5 border-border-alpha border-l border-r border-t',
                i === PRODUCTS.length - 1 && 'border-b',
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

        {/* Scroll handle */}
        <div className="flex justify-center py-4 shrink-0">
          <div className="w-[243px] h-[7px] bg-darker opacity-20 rounded-full" />
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/80"
            onClick={() => setLightboxOpen(false)}
          />

          {/* Prev button */}
          <button
            onClick={() => setLightboxIndex(i => Math.max(0, i - 1))}
            className={cn(
              'fixed left-6 top-1/2 -translate-y-1/2 z-[70] size-10 rounded-full backdrop-blur-[3.6px] bg-black/60 flex items-center justify-center transition-opacity',
              lightboxIndex === 0 ? 'opacity-30 cursor-default' : 'hover:bg-black/80',
            )}
          >
            <ChevronLeft className="size-6 text-white" />
          </button>

          {/* Image */}
          <div className="fixed inset-0 z-[65] flex items-center justify-center pointer-events-none px-24">
            <div className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden pointer-events-auto">
              <img
                src={IMAGES[lightboxIndex]}
                alt="Store"
                className="w-full h-full object-cover"
              />
              {/* Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-[3.6px] bg-black/60 px-4 py-2 rounded-full">
                <span className="text-white text-xs font-normal">
                  {lightboxIndex + 1} of {IMAGES.length} images
                </span>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() => setLightboxIndex(i => Math.min(IMAGES.length - 1, i + 1))}
            className={cn(
              'fixed right-6 top-1/2 -translate-y-1/2 z-[70] size-10 rounded-full backdrop-blur-[3.6px] bg-black/60 flex items-center justify-center transition-opacity',
              lightboxIndex === IMAGES.length - 1 ? 'opacity-30 cursor-default' : 'hover:bg-black/80',
            )}
          >
            <ChevronRight className="size-6 text-white" />
          </button>
        </>
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} />}
    </>
  )
}
