import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Archive, ChevronDown, CircleCheck, ChevronsDown, CircleDashed, FileDown,
  FlagTriangleRight, Forward, LayoutGrid, LayoutList, Check, Link,
  Search, Sheet, SlidersHorizontal, StickyNote, Upload, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubmissionDrawer } from '@/components/SubmissionDrawer'
import { Toast } from '@/components/ui/Toast'
import { ShareDialog } from '@/components/ShareDialog'
import { Tooltip } from '@/components/ui/Tooltip'

const imgStore1 = 'https://www.figma.com/api/mcp/asset/9025c9da-709d-4f18-9a81-41c33a7b83e0'
const imgStore2 = 'https://www.figma.com/api/mcp/asset/3b9ad25a-73bf-4493-8225-d2d38ff0dc54'
const imgStore3 = 'https://www.figma.com/api/mcp/asset/8373099e-bda5-4eaa-91b1-4c2bac4c2c66'

type BadgeVariant = 'flagged' | 'notes' | 'no-stock' | 'low-stock'

const BADGE_CONFIG: Record<BadgeVariant, {
  label: string
  wrapperClass: string
  Icon: React.ElementType
}> = {
  flagged: {
    label: 'Flagged',
    wrapperClass: 'bg-gradient-to-r from-[#fef2f2] to-[white] text-[#460809] dark:from-[#fef2f2]/10 dark:to-transparent dark:text-[#fca5a5]',
    Icon: FlagTriangleRight,
  },
  notes: {
    label: 'Notes',
    wrapperClass: 'bg-gradient-to-r from-[#eef2ff] to-[white] text-[#1e1a4d] dark:from-[#eef2ff]/10 dark:to-transparent dark:text-[#a5b4fc]',
    Icon: StickyNote,
  },
  'no-stock': {
    label: 'No Stock',
    wrapperClass: 'bg-[white] text-foreground dark:bg-white/5',
    Icon: CircleDashed,
  },
  'low-stock': {
    label: 'Low Stock',
    wrapperClass: 'bg-gradient-to-r from-[#fffbeb] to-[white] text-[#461901] dark:from-[#fffbeb]/10 dark:to-transparent dark:text-[#fcd34d]',
    Icon: ChevronsDown,
  },
}

function Badge({ variant }: { variant: BadgeVariant }) {
  const { label, wrapperClass, Icon } = BADGE_CONFIG[variant]
  return (
    <div className={cn(
      'flex items-center gap-1 px-3 py-2.5 rounded-md border border-black/5 text-xs font-semibold whitespace-nowrap shrink-0',
      wrapperClass,
    )}>
      <Icon className="size-4 opacity-40 shrink-0" />
      <span>{label}</span>
    </div>
  )
}

interface Submission {
  id: string
  storeName: string
  address: string
  image: string
  badges: BadgeVariant[]
  archived?: boolean
  imageCount?: number
  completedAt?: string
  completedBy?: string
  completedAvatar?: string
  noteCount?: number
}

const SUBMISSIONS: Submission[] = [
  {
    id: '1',
    storeName: 'Albertsons Newport Beach',
    address: '2660 San Miguel Dr, Newport Beach, CA, USA 92660',
    image: imgStore1,
    badges: ['flagged', 'notes', 'no-stock'],
    noteCount: 4,
    imageCount: 13,
    completedAt: 'Apr 18, 2026',
    completedBy: 'Jaqueline',
  },
  {
    id: '2',
    storeName: 'Vons Buena Park',
    address: '8148 La Palma Ave, Buena Park, CA, USA 90620',
    image: imgStore2,
    badges: ['notes', 'low-stock'],
    noteCount: 2,
    archived: true,
    imageCount: 7,
    completedAt: 'Apr 17, 2026',
    completedBy: 'Marcus',
  },
  {
    id: '3',
    storeName: 'Pavilions Garden Grove',
    address: '13200 Chapman Ave, Garden Grove, CA, USA 92840',
    image: imgStore3,
    badges: ['no-stock'],
    imageCount: 5,
    completedAt: 'Apr 16, 2026',
    completedBy: 'Sara',
  },
]

const SIGNAL_OPTIONS = [
  'Flagged',
  'Out of Stock',
  'Low Stock',
  'Good Stock',
  'Missing Product',
  'Promotional Pricing',
]

const DATE_OPTIONS = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'Month to Date',
  'Year to Date',
  'All Time',
]

const FILTER_SELECTS = ['State', 'Banner', 'Notes', 'Acc Manager', 'Campaign', 'Display Status']

const FILTER_OPTIONS: Record<string, string[]> = {
  'State':          ['CA'],
  'Banner':         ['Albertsons', 'Bel Air Foods', 'Nob Hill Foods', 'Pavilions', "Raley's", 'Vons'],
  'Notes':          ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
  'Acc Manager':    ['Direct Shop', 'Distributor', 'Grocery DC'],
  'Campaign':       ['Your Shelf Check'],
  'Display Status': ['All', 'Found', 'Not Found', 'Archived'],
}

function SubmissionCard({ submission, selected, onToggle, onOpen }: {
  submission: Submission
  selected: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  const [imgOpen, setImgOpen] = useState(false)

  return (
    <div
      onClick={onOpen}
      className={cn(
        'rounded-2xl shadow-[0px_2px_2px_0px_var(--shadow)] flex flex-col gap-4 pt-2.5 px-2.5 pb-4 cursor-pointer transition-all',
        selected
          ? 'border-2 border-primary bg-gradient-to-b from-[rgba(249,185,175,0.35)] to-[rgba(255,255,255,0.35)]'
          : 'border border-border bg-card',
      )}
    >
      {/* Image with controls */}
      <div className="group/img relative h-[193px] rounded-md shrink-0 w-full">
        <img
          src={submission.image}
          alt={submission.storeName}
          className="w-full h-full object-cover rounded-md"
        />

        {/* Archived badge */}
        {submission.archived && (
          <div className="absolute top-2.5 left-2.5 bg-brighter border border-black/5 rounded-md px-3 py-1.5">
            <span className="font-sans font-semibold text-xs leading-4 text-foreground whitespace-nowrap">Archived</span>
          </div>
        )}

        {/* Expand button — visible only on hover */}
        <button
          onClick={e => { e.stopPropagation(); setImgOpen(true) }}
          className="absolute top-2.5 right-2.5 size-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/75 transition-all opacity-0 group-hover/img:opacity-100"
        >
          <img src="https://www.figma.com/api/mcp/asset/140f4632-f821-42e0-a60a-5279e7fbc00e" alt="Expand" className="size-4" />
        </button>
      </div>

      {/* Image lightbox */}
      {imgOpen && createPortal(
        <div
          className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center"
          onClick={e => { e.stopPropagation(); setImgOpen(false) }}
        >
          <button
            onClick={e => { e.stopPropagation(); setImgOpen(false) }}
            className="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="size-5" />
          </button>
          <img
            src={submission.image}
            alt={submission.storeName}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>,
        document.body,
      )}

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-2.5">
        <span className="font-semibold text-sm leading-5 text-foreground underline decoration-dotted underline-offset-4">
          {submission.storeName}
        </span>
        <span className="text-sm leading-5 text-muted-foreground">
          {submission.address}
        </span>

        {/* Completed by */}
        {submission.completedAt && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-muted-foreground leading-none">Completed {submission.completedAt} by</span>
            <div className="size-4 rounded-full bg-[#ffb31f] flex items-center justify-center shrink-0">
              <span className="text-[8px] font-semibold text-white leading-none">
                {submission.completedBy?.[0]}
              </span>
            </div>
            <span className="text-xs text-muted-foreground leading-none">{submission.completedBy}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-4">
          {submission.badges.map(b => (
            b === 'notes' && submission.noteCount
              ? <Tooltip key={b} label={`${submission.noteCount} note${submission.noteCount !== 1 ? 's' : ''}`}><Badge variant={b} /></Tooltip>
              : <Badge key={b} variant={b} />
          ))}
          <div className="flex-1 flex items-center justify-end min-w-0">
            <div
              onClick={e => { e.stopPropagation(); onToggle() }}
              className={cn(
                'size-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                selected ? 'bg-darker shadow-sm' : 'border border-darker opacity-40',
              )}
            >
              {selected && <Check className="size-3 text-brighter" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionListRow({ submission, selected, onToggle, onOpen }: {
  submission: Submission
  selected: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  return (
    <div
      onClick={onOpen}
      className={cn(
        'rounded-2xl shadow-[0px_2px_2px_0px_var(--shadow)] flex items-center gap-4 pl-6 pr-2.5 py-2.5 cursor-pointer transition-all',
        selected
          ? 'border-2 border-primary bg-gradient-to-b from-[rgba(249,185,175,0.35)] to-[rgba(255,255,255,0.35)]'
          : 'border border-border bg-card',
      )}
    >
      {/* Checkbox */}
      <div
        onClick={e => { e.stopPropagation(); onToggle() }}
        className={cn(
          'size-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors cursor-pointer',
          selected ? 'bg-darker shadow-sm' : 'border border-darker opacity-40',
        )}
      >
        {selected && <Check className="size-3 text-brighter" />}
      </div>

      {/* Thumbnail */}
      <div className="relative size-20 rounded-md overflow-hidden shrink-0">
        <img src={submission.image} alt={submission.storeName} className="w-full h-full object-cover" />
        {submission.archived && (
          <div className="absolute top-1.5 right-1.5 bg-brighter border border-black/5 rounded-md px-2 py-1">
            <span className="font-sans font-semibold text-xs leading-4 text-foreground whitespace-nowrap">Archived</span>
          </div>
        )}
      </div>

      {/* Info + Badges */}
      <div className="flex flex-1 items-center gap-4 min-w-0 px-2.5">
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="font-semibold text-sm leading-5 text-foreground underline decoration-dotted underline-offset-4 whitespace-nowrap">
            {submission.storeName}
          </span>
          <span className="text-sm leading-5 text-muted-foreground whitespace-nowrap">
            {submission.address}
          </span>
          {submission.completedAt && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground leading-none whitespace-nowrap">Completed {submission.completedAt} by</span>
              <div className="size-4 rounded-full bg-[#ffb31f] flex items-center justify-center shrink-0">
                <span className="text-[8px] font-semibold text-white leading-none">{submission.completedBy?.[0]}</span>
              </div>
              <span className="text-xs text-muted-foreground leading-none whitespace-nowrap">{submission.completedBy}</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
          {submission.badges.map(b => (
            b === 'notes' && submission.noteCount
              ? <Tooltip key={b} label={`${submission.noteCount} note${submission.noteCount !== 1 ? 's' : ''}`}><Badge variant={b} /></Tooltip>
              : <Badge key={b} variant={b} />
          ))}
        </div>
      </div>
    </div>
  )
}

const RECENT_SEARCHES = [
  'Albertsons Newport Beach',
  'Vons Santa Monica',
  'Pavilions Pasadena',
  'Albertsons Anaheim',
  'Safeway Long Beach',
]

export function SubmissionsPage({ openDrawer = false }: { openDrawer?: boolean; onDrawerClose?: () => void }) {
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const [activeDateRange, setActiveDateRange] = useState('Today')
  const [openFilterSelect, setOpenFilterSelect] = useState<string | null>(null)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>(
    Object.fromEntries(FILTER_SELECTS.map(k => [
      k,
      (FILTER_OPTIONS[k] ?? []).filter(v => v !== 'Archived'),
    ])),
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(openDrawer)

  const showArchived = filterSelections['Display Status']?.includes('Archived') ?? false
  const filteredSubmissions = SUBMISSIONS.filter(s => {
    if (s.archived && !showArchived) return false
    if (!search.trim()) return true
    return (
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    )
  })

  useEffect(() => { if (openDrawer) setDrawerOpen(true) }, [openDrawer])

  const toggleFilterOption = (select: string, option: string) =>
    setFilterSelections(prev => {
      const cur = prev[select]
      return {
        ...prev,
        [select]: cur.includes(option) ? cur.filter(x => x !== option) : [...cur, option],
      }
    })

  const toggleSelected = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  const [signalOpen, setSignalOpen] = useState(false)
  const [activeSignals, setActiveSignals] = useState<string[]>([...SIGNAL_OPTIONS])
  const [islandSendOpen, setIslandSendOpen] = useState(false)
  const [islandFlagged, setIslandFlagged] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const signalBtnRef = useRef<HTMLButtonElement>(null)
  const signalDropdownRef = useRef<HTMLDivElement>(null)
  const islandSendBtnRef = useRef<HTMLButtonElement>(null)
  const islandSendDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(t) &&
        filterBtnRef.current && !filterBtnRef.current.contains(t)
      ) {
        setFilterOpen(false)
        setOpenFilterSelect(null)
      }
      if (
        signalDropdownRef.current && !signalDropdownRef.current.contains(t) &&
        signalBtnRef.current && !signalBtnRef.current.contains(t)
      ) {
        setSignalOpen(false)
      }
      if (
        islandSendDropdownRef.current && !islandSendDropdownRef.current.contains(t) &&
        islandSendBtnRef.current && !islandSendBtnRef.current.contains(t)
      ) {
        setIslandSendOpen(false)
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(t)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-medium text-2xl leading-8 text-foreground">The Shelf</h1>
        <div className="flex items-center gap-2">
          <Tooltip label="Select all">
            <button
              onClick={() =>
                setSelectedIds(prev =>
                  prev.size === SUBMISSIONS.length
                    ? new Set()
                    : new Set(SUBMISSIONS.map(s => s.id))
                )
              }
              className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <CircleCheck className={cn('size-4 transition-colors', selectedIds.size === SUBMISSIONS.length ? 'text-[#f91616]' : 'text-foreground')} />
            </button>
          </Tooltip>
          <Tooltip label="Export CSV">
            <button
              onClick={() => setToast('Exported to CSV successfully')}
              className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <Upload className="size-4 text-foreground" />
            </button>
          </Tooltip>
          <button className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors">
            <span>25 per page</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center p-0.5 bg-secondary rounded-full">
            <Tooltip label="Grid view">
              <button onClick={() => setView('grid')} className={cn('size-8 flex items-center justify-center rounded-full transition-colors', view === 'grid' ? 'bg-brighter shadow-sm' : 'hover:bg-accent')}>
                <LayoutGrid className={cn('size-4', view === 'grid' ? 'text-foreground' : 'text-muted-foreground')} />
              </button>
            </Tooltip>
            <Tooltip label="List view">
              <button onClick={() => setView('list')} className={cn('size-8 flex items-center justify-center rounded-full transition-colors', view === 'list' ? 'bg-brighter shadow-sm' : 'hover:bg-accent')}>
                <LayoutList className={cn('size-4', view === 'list' ? 'text-foreground' : 'text-muted-foreground')} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="relative flex items-center gap-3">
        <div ref={searchWrapperRef} className="flex-1 relative">
          <div className="flex items-center gap-1 h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search by store name, banner, city and state."
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
            />
          </div>
          {searchFocused && (() => {
            const q = search.trim().toLowerCase()
            const items = q
              ? RECENT_SEARCHES.filter(r => r.toLowerCase().includes(q))
              : RECENT_SEARCHES
            if (items.length === 0) return null
            return (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] overflow-hidden z-50">
                <p className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent searches</p>
                {items.map(item => (
                  <button
                    key={item}
                    onMouseDown={e => { e.preventDefault(); setSearch(item); setSearchFocused(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left"
                  >
                    <Search className="size-3.5 text-muted-foreground shrink-0" />
                    {item}
                  </button>
                ))}
              </div>
            )
          })()}
        </div>
        <div className="relative shrink-0">
          <button
            ref={signalBtnRef}
            onClick={() => setSignalOpen(o => !o)}
            className="h-9 flex items-center gap-2 pl-3 pr-2 py-2 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors"
          >
            <span className="shrink-0">Signal:</span>
            <span className="size-6 flex items-center justify-center bg-darker text-brighter rounded-full text-xs font-medium shrink-0">
              {activeSignals.length === SIGNAL_OPTIONS.length ? SIGNAL_OPTIONS.length : activeSignals.length}
            </span>
          </button>
          {signalOpen && (
            <div
              ref={signalDropdownRef}
              className="absolute top-full left-0 mt-2 w-[209px] bg-card dark:bg-muted border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-50"
            >
              {SIGNAL_OPTIONS.map((option, i) => {
                const isActive = activeSignals.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() =>
                      setActiveSignals(prev =>
                        prev.includes(option) ? prev.filter(x => x !== option) : [...prev, option],
                      )
                    }
                    className={cn(
                      'w-full flex items-center gap-3 h-11 px-4 text-left transition-colors',
                      i === 0 ? 'rounded-[14px] bg-accent' : 'rounded-full hover:bg-accent',
                    )}
                  >
                    <div className={cn(
                      'size-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors',
                      isActive ? 'bg-darker shadow-sm' : 'border border-darker/30',
                    )}>
                      {isActive && <Check className="size-3 text-brighter" />}
                    </div>
                    <span className="font-poppins font-medium text-sm text-sidebar-primary-foreground">
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <button
          ref={filterBtnRef}
          onClick={() => setFilterOpen(o => !o)}
          className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 hover:bg-accent transition-colors"
        >
          <SlidersHorizontal className="size-4 text-foreground" />
          <span className="size-6 flex items-center justify-center bg-darker text-brighter rounded-full text-xs font-medium shrink-0">
            {Object.values(filterSelections).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        </button>
        <button onClick={() => setSearch('')} className="h-9 flex items-center px-3 text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0">
          Clear
        </button>

        {/* Filter dropdown */}
        {filterOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 bg-card border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-3 flex gap-3 z-50"
          >
            {/* Left: date range */}
            <div className="flex flex-col p-0.5 w-[174px]">
              {DATE_OPTIONS.map((option, i) => (
                <button
                  key={option}
                  onClick={() => setActiveDateRange(option)}
                  className={cn(
                    'flex items-center h-11 px-4 gap-3 w-full text-left transition-colors',
                    i === 0 ? 'rounded-[14px]' : 'rounded-full',
                    activeDateRange === option ? 'bg-accent' : 'hover:bg-accent',
                  )}
                >
                  <span className="flex-1 font-poppins font-medium text-sm text-sidebar-primary-foreground whitespace-nowrap">
                    {option}
                  </span>
                  {activeDateRange === option && (
                    <Check className="size-5 text-sidebar-primary-foreground shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Right: filter selects */}
            <div className="flex flex-col gap-2 w-[195px]">
              {FILTER_SELECTS.map(label => {
                const opts = FILTER_OPTIONS[label] ?? []
                const selected = filterSelections[label] ?? []
                const hasCount = selected.length > 0 && selected.length < opts.length
                const isOpen = openFilterSelect === label
                return (
                  <div key={label} className="relative">
                    <button
                      onClick={e => { e.stopPropagation(); setOpenFilterSelect(o => o === label ? null : label) }}
                      className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors w-full"
                    >
                      <span className="flex-1 text-left">{label}</span>
                      {hasCount && (
                        <span className="size-6 flex items-center justify-center bg-darker text-brighter rounded-full text-xs font-medium shrink-0">
                          {selected.length}
                        </span>
                      )}
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-[209px] bg-background border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-10">
                        {opts.map((option, i) => {
                          const isActive = selected.includes(option)
                          return (
                            <button
                              key={option}
                              onClick={e => { e.stopPropagation(); toggleFilterOption(label, option) }}
                              className={cn(
                                'w-full flex items-center gap-3 h-11 px-4 text-left transition-colors',
                                i === 0 ? 'rounded-[14px] bg-accent' : 'rounded-full hover:bg-accent',
                              )}
                            >
                              <div className={cn(
                                'size-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors',
                                isActive ? 'bg-darker shadow-sm' : 'border border-darker/30',
                              )}>
                                {isActive && <Check className="size-3 text-brighter" />}
                              </div>
                              <span className="font-poppins font-medium text-sm text-sidebar-primary-foreground">
                                {option}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cards / List */}
      {filteredSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 min-h-[400px]">
          <img src="https://www.figma.com/api/mcp/asset/f6eb4b32-3525-4047-96ae-7fa1d23c2dcb" alt="" className="size-[120px]" />
          <p className="text-sm text-muted-foreground">No matching submissions</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-3 gap-3 pb-24">
          {filteredSubmissions.map(s => (
            <SubmissionCard
              key={s.id}
              submission={s}
              selected={selectedIds.has(s.id)}
              onToggle={() => toggleSelected(s.id)}
              onOpen={() => setDrawerOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-24">
          {filteredSubmissions.map(s => (
            <SubmissionListRow
              key={s.id}
              submission={s}
              selected={selectedIds.has(s.id)}
              onToggle={() => toggleSelected(s.id)}
              onOpen={() => setDrawerOpen(true)}
            />
          ))}
        </div>
      )}

      <SubmissionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Selection island */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 ease-out bg-brighter border border-border rounded-full shadow-[0px_0px_65.5px_0px_var(--shadow)] flex items-center gap-[30px] px-8 py-4">
            <span className="font-poppins font-medium text-sm text-[var(--red,#f91616)] whitespace-nowrap">
              {selectedIds.size} {selectedIds.size === 1 ? 'Store' : 'Stores'} selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="font-poppins font-medium text-sm text-foreground underline whitespace-nowrap hover:opacity-70 transition-opacity"
            >
              Clear
            </button>
            <div className="w-px h-[26px] bg-border shrink-0" />
            <div className="flex items-center gap-2">
              <Tooltip label="Flag">
                <button
                  onClick={() => setIslandFlagged(f => !f)}
                  className={cn(
                    'size-9 flex items-center justify-center rounded-full transition-colors',
                    islandFlagged
                      ? 'bg-gradient-to-r from-soft-red to-brighter'
                      : 'bg-background hover:bg-accent',
                  )}
                >
                  <FlagTriangleRight className={cn('size-4 transition-colors', islandFlagged ? 'text-[#f91616]' : 'text-foreground')} />
                </button>
              </Tooltip>
              <Tooltip label="Archive">
                <button onClick={() => setToast('Submissions archived successfully')} className="size-9 flex items-center justify-center rounded-full bg-background hover:bg-accent transition-colors">
                  <Archive className="size-4 text-foreground" />
                </button>
              </Tooltip>
              <div className="relative">
                <Tooltip label="Send">
                  <button
                    ref={islandSendBtnRef}
                    onClick={() => setIslandSendOpen(o => !o)}
                    className="size-9 flex items-center justify-center rounded-full bg-background hover:bg-accent transition-colors"
                  >
                    <Forward className="size-4 text-foreground" />
                  </button>
                </Tooltip>
                {islandSendOpen && (
                  <div
                    ref={islandSendDropdownRef}
                    className="absolute right-0 bottom-full mb-2 w-[180px] bg-card border border-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-[60] flex flex-col"
                  >
                    {[
                      { label: 'Export to PDF', Icon: FileDown, toast: 'Exported to PDF successfully' },
                      { label: 'Export to CSV', Icon: Sheet,    toast: 'Exported to CSV successfully' },
                      { label: 'Share URL',     Icon: Link,     toast: null },
                    ].map(({ label, Icon, toast: msg }) => (
                      <button
                        key={label}
                        onClick={() => { setIslandSendOpen(false); if (msg) setToast(msg); if (label === 'Share URL') setShareOpen(true) }}
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
        </div>
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} onCopy={() => setToast('Link copied successfully')} />}
    </div>
  )
}
