import { useState, useRef, useEffect } from 'react'
import {
  MoveDown, CircleDashed, Check, FlagTriangleRight, Ban,
  ChevronDown, Search, Tags, Upload, TableProperties, Map,
  ChevronRight, Sparkles, Plus, Minus, ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import raleysLogo from '@/assets/logos/raleys.png'
import pavilionsLogo from '@/assets/logos/pavilions.png'
import albertsonsLogo from '@/assets/logos/albertsons.png'

const MAP_IMAGE = 'https://www.figma.com/api/mcp/asset/e66f2024-23e3-492e-af4f-07cf36c8ed1d'

type StoreDot = {
  id: number
  x: number
  y: number
  color: string
  ring: boolean
  name: string
  address: string
  banner: string
  bannerLogo?: string
  signals: { label: string; Icon: React.ElementType; variant: 'red' | 'default' }[]
  risk: { label: string; percent: number }
}

const STORE_DOTS: StoreDot[] = [
  {
    id: 1, x: 35.6, y: 47.4, color: '#f91616', ring: true,
    name: 'Anaheim Albertson Store',
    address: '2660 San Miguel Drive, Newport Beach, CA, US - 92660',
    banner: 'VONS',
    bannerLogo: 'https://www.figma.com/api/mcp/asset/5e3ed23e-3f63-4355-aedc-cb76b5311d7a',
    signals: [
      { label: 'Flagged',  Icon: FlagTriangleRight, variant: 'red'     },
      { label: 'No Stock', Icon: CircleDashed,      variant: 'default' },
    ],
    risk: { label: 'High', percent: 68 },
  },
  {
    id: 2, x: 17.4, y: 20.2, color: '#f91616', ring: false,
    name: 'Buena Park Vons',
    address: '8148 La Palma Ave, Buena Park, CA, US - 90620',
    banner: 'VONS',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'Medium', percent: 42 },
  },
  {
    id: 3, x: 8.7, y: 41.8, color: '#519249', ring: false,
    name: 'Cerritos Albertsons',
    address: '11901 South St, Cerritos, CA, US - 90703',
    banner: 'ALBERTSONS',
    bannerLogo: albertsonsLogo,
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 15 },
  },
  {
    id: 4, x: 18.0, y: 63.8, color: '#519249', ring: false,
    name: 'Garden Grove Pavilions',
    address: '13200 Chapman Ave, Garden Grove, CA, US - 92840',
    banner: 'PAVILIONS',
    bannerLogo: pavilionsLogo,
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 10 },
  },
  {
    id: 5, x: 71.3, y: 84.4, color: '#f59e0b', ring: false,
    name: 'Santa Ana Raleys',
    address: '3737 S Bristol St, Santa Ana, CA, US - 92704',
    banner: 'RALEYS',
    bannerLogo: raleysLogo,
    signals: [{ label: 'Promotion', Icon: Tags, variant: 'default' }],
    risk: { label: 'Low', percent: 20 },
  },
]

const RISK_STYLES: Record<RiskLevel, { badgeFrom: string; badgeText: string; barColor: string }> = {
  High:   { badgeFrom: 'from-soft-red',   badgeText: 'text-soft-red-foreground',   barColor: 'var(--red)'   },
  Medium: { badgeFrom: 'from-soft-amber', badgeText: 'text-soft-amber-foreground', barColor: 'var(--amber)' },
  Low:    { badgeFrom: 'from-soft-green', badgeText: 'text-soft-lime-foreground',  barColor: 'var(--green)' },
}

function StoreMapPopover({ store, anchorEl, onClose, onLearnMore }: {
  store: StoreDot
  anchorEl: HTMLElement
  onClose: () => void
  onLearnMore: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [barFilled, setBarFilled] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
          !anchorEl.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [anchorEl, onClose])

  useEffect(() => {
    setBarFilled(false)
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setBarFilled(true))
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [store])

  const rect = anchorEl.getBoundingClientRect()
  const popoverWidth = 267
  const popoverHeight = 320
  let left = rect.left + rect.width / 2 - popoverWidth / 2
  let top = rect.top - popoverHeight - 12
  if (top < 8) top = rect.bottom + 12
  left = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8))

  const riskStyle = RISK_STYLES[store.risk.label as RiskLevel]
  const { barColor: riskColor } = riskStyle

  return (
    <div
      ref={popoverRef}
      className="fixed z-[300] w-[267px] bg-card border border-border rounded-2xl shadow-[0px_0px_65.5px_0px_var(--shadow)] flex flex-col"
      style={{
        top,
        left,
        animation: 'popoverIn 150ms ease-out forwards',
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 px-5 pt-4">
        <div className="flex flex-col gap-1 relative">
          <div className="flex items-start justify-between gap-2">
            <span className="font-sans font-medium text-sm text-card-foreground leading-5">{store.name}</span>
            {store.bannerLogo ? (
              <div className="shrink-0 h-[27px] w-[55px] border border-border rounded-full overflow-hidden flex items-center justify-center px-2 bg-white">
                <img
                  src={store.bannerLogo}
                  alt={store.banner}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <span className="shrink-0 text-[10px] font-bold border border-border rounded-full px-2 py-0.5 text-card-foreground/80 tracking-wide">
                {store.banner}
              </span>
            )}
          </div>
          <span className="font-sans text-xs text-card-foreground/70 leading-4">{store.address}</span>
        </div>

        <span className="font-sans font-medium text-sm text-card-foreground leading-5">
          Signals ({store.signals.length})
        </span>

        <div className="flex flex-wrap gap-2 pb-4">
          {store.signals.map(sig => (
            <div
              key={sig.label}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-md border border-black/5 text-xs font-semibold',
                sig.variant === 'red'
                  ? 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground'
                  : 'bg-card text-foreground',
              )}
            >
              <span>{sig.label}</span>
              <sig.Icon className="size-3.5 opacity-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Risk */}
      <div className="flex flex-col gap-4 px-5 py-4 border-t border-border-alpha">
        <div className="flex items-center gap-4">
          <span className="flex-1 font-sans font-medium text-sm text-card-foreground leading-5">Risk</span>
          <div className={cn('flex items-center px-3 py-1 rounded-md border border-black/5 bg-gradient-to-r to-brighter', riskStyle.badgeFrom)}>
            <span className={cn('font-sans font-semibold text-xs leading-4 whitespace-nowrap', riskStyle.badgeText)}>
              {store.risk.label}
            </span>
          </div>
        </div>
        <div className="relative h-[6px] w-full rounded-full">
          <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: riskColor }} />
          <div
            className="absolute left-0 top-0 h-full rounded-full opacity-70"
            style={{
              width: barFilled ? `${store.risk.percent}%` : '0%',
              backgroundColor: riskColor,
              transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-px h-3.5 rounded-full opacity-80"
            style={{ left: '53%', backgroundColor: riskColor }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border-alpha">
        <button
          onClick={onLearnMore}
          className="w-full h-9 flex items-center justify-center gap-2 border border-black/5 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
        >
          Learn more
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function MapView({ onLearnMore }: { onLearnMore: () => void }) {
  const [selected, setSelected] = useState<{ store: StoreDot; el: HTMLElement } | null>(null)

  function handleDotClick(e: React.MouseEvent<HTMLButtonElement>, store: StoreDot) {
    e.stopPropagation()
    const el = e.currentTarget
    setSelected(prev => prev?.store.id === store.id ? null : { store, el })
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border" style={{ height: 580 }}>
      <img
        src={MAP_IMAGE}
        alt="Anaheim area store map"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(0)' }}
      />
      {STORE_DOTS.map(dot => (
        <button
          key={dot.id}
          onClick={e => handleDotClick(e, dot)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
          {dot.ring && (
            <div
              className="absolute -inset-3 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ backgroundColor: dot.color }}
            />
          )}
          <div
            className="size-3.5 rounded-full shadow-sm group-hover:scale-125 transition-transform"
            style={{
              backgroundColor: dot.color,
              boxShadow: dot.ring ? `0 0 0 2px white, 0 0 0 3px ${dot.color}` : undefined,
            }}
          />
        </button>
      ))}
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-9">
        <button className="h-9 flex items-center justify-center hover:bg-accent transition-colors border-b border-border">
          <Plus className="size-4 text-foreground" />
        </button>
        <button className="h-9 flex items-center justify-center hover:bg-accent transition-colors">
          <Minus className="size-4 text-foreground" />
        </button>
      </div>

      {selected && (
        <StoreMapPopover
          store={selected.store}
          anchorEl={selected.el}
          onClose={() => setSelected(null)}
          onLearnMore={onLearnMore}
        />
      )}
    </div>
  )
}

const SIGNAL_CARDS = [
  { label: 'Flagged',    count: '12', Icon: FlagTriangleRight, iconClass: 'text-orange-400'       },
  { label: 'No Stock',   count: '6',  Icon: CircleDashed,      iconClass: 'text-muted-foreground' },
  { label: 'Low Stock',  count: '1',  Icon: MoveDown,          iconClass: 'text-red'              },
  { label: 'Good Stock', count: '8',  Icon: Check,             iconClass: 'text-green'            },
  { label: 'Missing',    count: '12', Icon: Ban,               iconClass: 'text-muted-foreground' },
  { label: 'Promotion',  count: '-',  Icon: Tags,              iconClass: 'text-orange-400'       },
]

const COLUMNS = [
  { key: 'banner',          label: 'Banner'            },
  { key: 'checked',         label: 'Checked'           },
  { key: 'past30',          label: 'Past 30 Days'      },
  { key: 'skuOosRate',      label: 'SKU OOS Rate'      },
  { key: 'skuLowStockRate', label: 'SKU Low Stock Rate'},
  { key: 'brandNotFound',   label: 'Brand Not Found'   },
  { key: 'skuNotCarried',   label: 'SKU Not Carried'   },
  { key: 'onSaleRate',      label: 'On Sale Rate'      },
  { key: 'uniqueSkus',      label: 'Unique SKUs'       },
]

type RiskLevel = 'High' | 'Medium' | 'Low'

type Row = {
  banner: string
  checked: number
  past30: number
  skuOosRate: string
  skuLowStockRate: string
  brandNotFound: number
  skuNotCarried: number
  onSaleRate: string
  uniqueSkus: number
  risk: { label: RiskLevel; percent: number }
  linkedFields?: string[]
  signal: string
  aiSuggestions: [string, string, string]
}

const ROWS: Row[] = [
  {
    banner: 'Albertsons', checked: 22, past30: 22, skuOosRate: '5%',  skuLowStockRate: '12.3%', brandNotFound: 7,  skuNotCarried: 15, onSaleRate: '80%', uniqueSkus: 3,
    risk: { label: 'High',   percent: 68 }, linkedFields: ['skuOosRate', 'brandNotFound'],
    signal: 'Elevated OOS rate and brand not found incidents detected. Replenishment and authorization gaps are compounding availability issues.',
    aiSuggestions: ['Check replenishment cadence by distributor', 'Review brand authorization status', 'Trigger restock alert or field verification'],
  },
  {
    banner: 'Vons', checked: 30, past30: 30, skuOosRate: '2%',  skuLowStockRate: '10.5%', brandNotFound: 10, skuNotCarried: 20, onSaleRate: '85%', uniqueSkus: 4,
    risk: { label: 'High',   percent: 75 }, linkedFields: ['skuOosRate', 'brandNotFound', 'skuNotCarried'],
    signal: 'Multiple compounding issues: elevated OOS, brand not found, and SKUs not carried. Broad availability breakdown across this banner.',
    aiSuggestions: ['Audit SKU listing and authorization', 'Compare OOS by region/store cluster', 'Escalate to category manager for SKU review'],
  },
  {
    banner: 'Pavilions', checked: 15, past30: 15, skuOosRate: '1%',  skuLowStockRate: '9.0%',  brandNotFound: 4,  skuNotCarried: 8,  onSaleRate: '70%', uniqueSkus: 2,
    risk: { label: 'Low',    percent: 15 },
    signal: 'Performance within expected thresholds. No critical signals detected — availability is stable at this banner.',
    aiSuggestions: ['Monitor for seasonal stock changes', 'Schedule routine shelf audit', 'Maintain current replenishment cadence'],
  },
  {
    banner: 'Raleys', checked: 25, past30: 25, skuOosRate: '3%',  skuLowStockRate: '14.0%', brandNotFound: 9,  skuNotCarried: 18, onSaleRate: '90%', uniqueSkus: 5,
    risk: { label: 'Medium', percent: 42 }, linkedFields: ['skuOosRate', 'skuNotCarried'],
    signal: 'Moderate OOS rate paired with SKUs not carried. Availability gaps may reduce brand presence on shelf.',
    aiSuggestions: ['Review SKU authorization with buyer', 'Compare OOS trends week-over-week', 'Request shelf space audit from field rep'],
  },
  {
    banner: 'Belair', checked: 20, past30: 20, skuOosRate: '4%',  skuLowStockRate: '11.5%', brandNotFound: 6,  skuNotCarried: 12, onSaleRate: '78%', uniqueSkus: 3,
    risk: { label: 'Medium', percent: 35 }, linkedFields: ['skuNotCarried'],
    signal: 'SKUs not carried is the primary concern. Products may not be listed or authorized at this banner.',
    aiSuggestions: ['Verify SKU authorization status', 'Engage buyer to expand SKU listing', 'Track competitive shelf presence'],
  },
  {
    banner: 'Nob Hill', checked: 35, past30: 35, skuOosRate: '6%',  skuLowStockRate: '15.0%', brandNotFound: 12, skuNotCarried: 25, onSaleRate: '88%', uniqueSkus: 6,
    risk: { label: 'High',   percent: 82 }, linkedFields: ['skuOosRate'],
    signal: 'Critically high OOS rate detected. Replenishment failures or demand spikes are driving significant availability gaps.',
    aiSuggestions: ['Escalate to distributor for emergency restock', 'Investigate root cause of OOS spikes', 'Set up automated restock alerts'],
  },
]


function RowPopover({ style, risk, signal, aiSuggestions }: {
  style: React.CSSProperties
  risk: Row['risk']
  signal: string
  aiSuggestions: Row['aiSuggestions']
}) {
  const rs = RISK_STYLES[risk.label]
  const [barFilled, setBarFilled] = useState(false)

  useEffect(() => {
    setBarFilled(false)
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setBarFilled(true))
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [risk])

  return (
    <div
      style={{
        ...style,
        transition: 'top 120ms ease-in-out, left 120ms ease-in-out',
        animation: 'popoverIn 150ms ease-out forwards',
      }}
      className="fixed z-[200] w-[251px] bg-card border border-border rounded-2xl shadow-[0px_0px_65.5px_0px_var(--shadow)] flex flex-col pointer-events-none"
    >
      {/* Signal section */}
      <div className="flex flex-col gap-4 px-5 pt-4 pb-0">
        <p className="font-sans font-medium text-sm text-card-foreground leading-5">Signal</p>
        <p className="font-sans text-sm text-card-foreground/70 leading-5">{signal}</p>
      </div>

      {/* Risk section */}
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="flex-1 font-sans font-medium text-sm text-card-foreground leading-5">Risk</span>
          <div className={cn('flex items-center gap-1 px-3 py-1 rounded-md border border-black/5 bg-gradient-to-r to-brighter', rs.badgeFrom)}>
            <span className={cn('font-sans font-semibold text-xs leading-4 whitespace-nowrap', rs.badgeText)}>{risk.label}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative h-[6px] w-full">
          <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: rs.barColor }} />
          <div
            className="absolute left-0 top-0 h-full rounded-full opacity-70"
            style={{
              width: barFilled ? `${risk.percent}%` : '0%',
              backgroundColor: rs.barColor,
              transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-px h-3.5 rounded-full opacity-80"
            style={{ left: '53%', backgroundColor: rs.barColor }}
          />
        </div>
      </div>

      {/* Ai.Lean section */}
      <div className="p-1">
        <div
          className="flex flex-col gap-4 px-5 py-4 rounded-xl overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 92% 88%, #fef8f7 0%, #ffffff 100%)' }}
        >
          <div className="flex items-center gap-4">
            <span className="flex-1 font-sans font-medium text-sm text-foreground leading-5">Ai.Lean</span>
            <Sparkles className="size-4 text-muted-foreground opacity-60" />
          </div>
          <div className="flex flex-col gap-1.5">
            {aiSuggestions.map(text => (
              <div key={text} className="flex gap-1 items-start">
                <ChevronRight className="size-4 text-foreground shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-card-foreground/70 leading-5">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CellValue({ row, col }: { row: Row; col: typeof COLUMNS[number] }) {
  const value = row[col.key as keyof Row]
  const isLinked = row.linkedFields?.includes(col.key)
  const isName = col.key === 'banner'

  return (
    <span className={cn(
      'font-sans font-medium text-sm leading-none',
      isName
        ? 'text-foreground underline decoration-dotted'
        : 'text-muted-foreground',
      isLinked && !isName && 'underline decoration-dotted',
    )}>
      {String(value)}
    </span>
  )
}

export function StoresPage({ onLearnMore, onNavigateToShelf }: { onLearnMore?: () => void; onNavigateToShelf?: () => void }) {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'map'>('table')
  const [popoverState, setPopoverState] = useState<{ top: number; left: number; risk: Row['risk']; signal: string; aiSuggestions: Row['aiSuggestions'] } | null>(null)

  function handleRowMouseMove(e: React.MouseEvent<HTMLDivElement>, row: Row) {
    const x = e.clientX + 16
    const y = e.clientY + 16
    const top = Math.min(y, window.innerHeight - 420)
    const left = Math.max(8, Math.min(x, window.innerWidth - 267))
    setPopoverState(prev =>
      prev?.risk === row.risk ? { ...prev, top, left } : { top, left, risk: row.risk, signal: row.signal, aiSuggestions: row.aiSuggestions }
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-medium text-2xl leading-8 text-foreground">Stores</h1>
        <div className="flex items-center gap-2">
          <button className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
            <Upload className="size-4 text-foreground" />
          </button>
          <button className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors">
            <span>25 per page</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center p-0.5 bg-secondary rounded-full">
            <button
              onClick={() => setView('table')}
              className={cn(
                'size-8 flex items-center justify-center rounded-full transition-colors',
                view === 'table' ? 'bg-brighter shadow-sm' : 'hover:bg-accent',
              )}
            >
              <TableProperties className={cn('size-4', view === 'table' ? 'text-foreground' : 'text-muted-foreground')} />
            </button>
            <button
              onClick={() => setView('map')}
              className={cn(
                'size-8 flex items-center justify-center rounded-full transition-colors',
                view === 'map' ? 'bg-brighter shadow-sm' : 'hover:bg-accent',
              )}
            >
              <Map className={cn('size-4', view === 'map' ? 'text-foreground' : 'text-muted-foreground')} />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by store name, banner, city and state."
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          />
        </div>
        <button
          onClick={() => setSearch('')}
          className="font-sans text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0"
        >
          Clear
        </button>
      </div>

      {/* Signal cards */}
      <div className="grid grid-cols-6 gap-4">
        {SIGNAL_CARDS.map(({ label, count, Icon, iconClass }) => (
          <button
            key={label}
            onClick={() => onNavigateToShelf?.()}
            className="relative flex flex-col justify-between h-[113px] p-4 bg-card border border-border rounded-2xl shadow-[0px_2px_2px_0px_var(--shadow)] text-left hover:bg-accent transition-colors"
          >
            <div className="flex flex-col flex-1 justify-between">
              <span className="font-sans font-light text-xs text-foreground leading-none">{label}</span>
              <span className="font-sans font-medium text-xl leading-7 text-foreground">{count}</span>
            </div>
            <Icon className={cn('absolute top-4 right-4 size-4', iconClass)} />
          </button>
        ))}
      </div>

      {view === 'map' ? (
        <MapView onLearnMore={() => onLearnMore?.()} />
      ) : (
        <>
          {/* Table */}
          <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-border-alpha bg-card shadow-[0px_2px_2px_0px_var(--shadow)]">
            {/* Header row */}
            <div className="flex items-center gap-4 px-6 py-4 bg-accent border-b border-border-alpha">
              {COLUMNS.map(col => (
                <div key={col.key} className="flex-1 min-w-0">
                  <span className="font-sans font-medium text-xs text-muted-foreground uppercase leading-none tracking-wide whitespace-nowrap">
                    {col.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.banner}
                className={cn(
                  'flex items-center gap-4 px-6 py-5 border-t border-border-alpha transition-colors hover:bg-accent/60',
                  i === 0 && 'border-t-0',
                )}
                onMouseMove={e => handleRowMouseMove(e, row)}
                onMouseLeave={() => setPopoverState(null)}
              >
                {COLUMNS.map(col => (
                  <div key={col.key} className="flex-1 min-w-0">
                    <CellValue row={row} col={col} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {popoverState && (
            <RowPopover
              style={{ top: popoverState.top, left: popoverState.left }}
              risk={popoverState.risk}
              signal={popoverState.signal}
              aiSuggestions={popoverState.aiSuggestions}
            />
          )}
        </>
      )}
    </div>
  )
}
