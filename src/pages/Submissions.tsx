import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown, CircleCheck, ChevronsDown, CircleDashed,
  FlagTriangleRight, LayoutGrid, LayoutList, Check,
  Search, SlidersHorizontal, StickyNote, Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

const FILTER_OPTIONS = [
  'Flagged',
  'Out of Stock',
  'Low Stock',
  'Good Stock',
  'Missing Product',
  'Promotional Pricing',
]

function SubmissionCard({ submission }: { submission: Submission }) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-[0px_2px_2px_0px_var(--shadow)] flex flex-col gap-4 pt-2.5 px-2.5 pb-4">
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
            <div className="size-4 rounded-[4px] border border-darker opacity-40 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SubmissionsPage() {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([...FILTER_OPTIONS])
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(t) &&
        filterBtnRef.current && !filterBtnRef.current.contains(t)
      ) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleFilter = (f: string) =>
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f],
    )

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-medium text-2xl leading-8 text-foreground">The Shelf</h1>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="size-9 flex items-center justify-center rounded-md opacity-50 cursor-default"
          >
            <CircleCheck className="size-4 text-foreground" />
          </button>
          <button className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
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
        <button className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground shrink-0 hover:bg-accent transition-colors">
          <span>Signal: All</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <button
          ref={filterBtnRef}
          onClick={() => setFilterOpen(o => !o)}
          className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 hover:bg-accent transition-colors"
        >
          <SlidersHorizontal className="size-4 text-foreground" />
          <span className="size-6 flex items-center justify-center bg-darker text-brighter rounded-full text-xs font-medium shrink-0">
            {activeFilters.length}
          </span>
        </button>
        <button className="h-9 flex items-center px-3 text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0">
          Clear
        </button>

        {/* Filter dropdown */}
        {filterOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-[209px] bg-card dark:bg-muted border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-50"
          >
            {FILTER_OPTIONS.map((option, i) => {
              const isActive = activeFilters.includes(option)
              return (
                <button
                  key={option}
                  onClick={() => toggleFilter(option)}
                  className={cn(
                    'w-full flex items-center gap-3 h-11 px-4 text-left transition-colors',
                    i === 0
                      ? 'rounded-[14px] bg-accent'
                      : 'rounded-full hover:bg-accent',
                  )}
                >
                  <div className={cn(
                    'size-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors',
                    isActive
                      ? 'bg-darker shadow-sm'
                      : 'border border-darker/30',
                  )}>
                    {isActive && <Check className="size-3 text-brighter" />}
                  </div>
                  <span className="font-poppins font-medium text-sm text-sidebar-foreground">
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-3">
        {SUBMISSIONS.map(s => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
      </div>
    </div>
  )
}
