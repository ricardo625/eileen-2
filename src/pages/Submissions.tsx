import { useEffect, useRef, useState } from 'react'
import {
  Archive, ChevronDown, CircleCheck, ChevronsDown, CircleDashed,
  FileDown, FlagTriangleRight, Forward, LayoutGrid, LayoutList, Check,
  Link, Search, Sheet, SlidersHorizontal, StickyNote, Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubmissionDrawer } from '@/components/SubmissionDrawer'
import { Toast } from '@/components/ui/Toast'
import { ShareDialog } from '@/components/ShareDialog'

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
}

const SUBMISSIONS: Submission[] = [
  {
    id: '1',
    storeName: 'Target Shorewood',
    address: '1111 Brook Forest Aya, Shorewood, IL, USA 60423',
    image: imgStore1,
    badges: ['flagged', 'notes', 'no-stock'],
  },
  {
    id: '2',
    storeName: 'Target Shorewood',
    address: '1111 Brook Forest Aya, Shorewood, IL, USA 60423',
    image: imgStore2,
    badges: ['notes', 'low-stock'],
  },
  {
    id: '3',
    storeName: 'Target Shorewood',
    address: '1111 Brook Forest Aya, Shorewood, IL, USA 60423',
    image: imgStore3,
    badges: ['no-stock'],
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

function SubmissionCard({ submission, selected, onToggle, onOpen }: {
  submission: Submission
  selected: boolean
  onToggle: () => void
  onOpen: () => void
}) {
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
      <div className="h-[193px] rounded-md overflow-hidden shrink-0 w-full">
        <img
          src={submission.image}
          alt={submission.storeName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1.5 px-2.5">
        <span className="font-semibold text-sm leading-5 text-foreground underline decoration-dotted">
          {submission.storeName}
        </span>
        <span className="text-sm leading-5 text-muted-foreground">
          {submission.address}
        </span>
        <div className="flex items-center gap-1.5 pt-4">
          {submission.badges.map(b => (
            <Badge key={b} variant={b} />
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

export function SubmissionsPage({ openDrawer = false, onDrawerClose }: { openDrawer?: boolean; onDrawerClose?: () => void }) {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeDateRange, setActiveDateRange] = useState('Today')
  const [openFilterSelect, setOpenFilterSelect] = useState<string | null>(null)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>(
    Object.fromEntries(FILTER_SELECTS.map(k => [k, [...SIGNAL_OPTIONS]])),
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(openDrawer)

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
          <button
            onClick={() => setToast('Exported to CSV successfully')}
            className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <Upload className="size-4 text-foreground" />
          </button>
          <button className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors">
            <span>25 per page</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center p-0.5 bg-secondary rounded-full">
            <button className="size-8 flex items-center justify-center rounded-full bg-brighter shadow-sm">
              <LayoutGrid className="size-4 text-foreground" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
              <LayoutList className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 flex items-center gap-1 h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by store name, banner, city and state."
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          />
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
            {Object.values(filterSelections).filter(v => v.length < SIGNAL_OPTIONS.length).length}
          </span>
        </button>
        <button className="h-9 flex items-center px-3 text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0">
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
                const count = filterSelections[label]?.length ?? 0
                const hasCount = count > 0 && count < SIGNAL_OPTIONS.length
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
                          {count}
                        </span>
                      )}
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-[209px] bg-background border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-10">
                        {SIGNAL_OPTIONS.map((option, i) => {
                          const isActive = filterSelections[label]?.includes(option)
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

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-3 pb-24">
        {SUBMISSIONS.map(s => (
          <SubmissionCard
            key={s.id}
            submission={s}
            selected={selectedIds.has(s.id)}
            onToggle={() => toggleSelected(s.id)}
            onOpen={() => setDrawerOpen(true)}
          />
        ))}
      </div>

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
              <button className="size-9 flex items-center justify-center rounded-full bg-background hover:bg-accent transition-colors">
                <Archive className="size-4 text-foreground" />
              </button>
              <div className="relative">
                <button
                  ref={islandSendBtnRef}
                  onClick={() => setIslandSendOpen(o => !o)}
                  className="size-9 flex items-center justify-center rounded-full bg-background hover:bg-accent transition-colors"
                >
                  <Forward className="size-4 text-foreground" />
                </button>
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
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} />}
    </div>
  )
}
