import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, Check, MoveDown, CircleDashed, NotepadText, TableProperties, Map } from 'lucide-react'

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'block', flexShrink: 0 }}>
      <path d="M8 0C3.582 0 0 3.582 0 8C0 12.418 8 20 8 20C8 20 16 12.418 16 8C16 3.582 12.418 0 8 0Z" fill="var(--red)" />
      <circle cx="8" cy="8" r="2.5" fill="white" />
    </svg>
  )
}
import { cn } from '@/lib/utils'

const PRODUCT_IMG_1 = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&auto=format&fit=crop'
const PRODUCT_IMG_2 = 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=80&auto=format&fit=crop'
const PRODUCT_IMG_3 = 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=80&auto=format&fit=crop'

const SKU_ROWS = [
  { id: '1', image: PRODUCT_IMG_1, name: 'Mango Spark - 6 pack Bottles',  minPrice: '$19,99', commonPrice: '$18,99', maxPrice: '$20,99', onSale: '10.5%', commonSalePrice: '$18,99' },
  { id: '2', image: PRODUCT_IMG_2, name: 'Berry Bliss - 12 pack Cans',    minPrice: '$24,99', commonPrice: '$23,99', maxPrice: '$26,99', onSale: '9.8%',  commonSalePrice: '$23,99' },
  { id: '3', image: PRODUCT_IMG_3, name: 'Citrus Wave - 4 pack Bottles',  minPrice: '$14,99', commonPrice: '$13,99', maxPrice: '$15,99', onSale: '11.0%', commonSalePrice: '$13,99' },
]

const TABS = ['Overview', 'All Submissions', 'Configuration'] as const
type Tab = (typeof TABS)[number]

const STAT_CARDS = [
  { label: 'Total Stores Checked', value: '12', icon: Check,        iconColor: 'text-[var(--green)]' },
  { label: 'OOS Occurrences',       value: '6',  icon: CircleDashed, iconColor: 'text-muted-foreground' },
  { label: 'Low Stock Rate',        value: '1',  icon: MoveDown,     iconColor: 'text-[var(--red)]' },
]

const INVENTORY_ITEMS = [
  { label: 'Out of Stock', count: 5, textColor: 'text-[var(--soft-red-foreground)]',   gradient: 'from-[var(--brighter)] to-[var(--red)]',   opacity: 0.4,  dashed: false },
  { label: 'Low Stock',    count: 3, textColor: 'text-[var(--soft-amber-foreground)]', gradient: 'from-[var(--brighter)] to-[var(--amber)]',  opacity: 0.3,  dashed: false },
  { label: 'Good Stock',   count: 2, textColor: 'text-[var(--soft-green-foreground)]', gradient: 'from-[var(--brighter)] to-[var(--green)]',  opacity: 0.4,  dashed: false },
  { label: 'Not Found',    count: 4, textColor: 'text-foreground',                     gradient: null,                                         opacity: null, dashed: true  },
]
const INVENTORY_MAX = 5

const SKU_PRICE_BARS = [44, 91, 83, 183, 106, 83, 106, 106]
const SKU_PRICE_HIGHLIGHTED = 3
const SKU_PRICE_MIN = 13.99
const SKU_PRICE_MAX = 15.99

const SHELF_DOTS = [
  { x: 0.12, yVal: 1.2, inner: 10, outer: 21 },
  { x: 0.15, yVal: 3.5, inner: 17, outer: 35 },
  { x: 0.44, yVal: 5.0, inner: 12, outer: 25 },
  { x: 0.80, yVal: 4.5, inner: 12, outer: 25 },
]

const SHELF_LIST = [
  { name: 'Pavillions',         pct: 33 },
  { name: 'Vons',               pct: 20 },
  { name: 'Albertsons Market',  pct: 20 },
  { name: "Raley's",            pct: 10 },
  { name: 'Bel Air Foods',      pct: 9  },
  { name: 'Nob Hill Foods',     pct: 8  },
]

const STORE_ROWS = [
  { name: 'Albertsons Newport Beach', address: '2660 San Miguel Drive, Newport Beach, CA, USA 92660', submissions: 6,  date: 'Apr 16, 2026' },
  { name: 'Pavillions Garden Grove',  address: '13200 Chapman Ave, Garden Grove, CA, USA 92840',      submissions: 4,  date: 'Apr 16, 2026' },
  { name: 'Safeway Burbank',          address: '1611 W Olive Ave, Burbank, CA, USA 91506',            submissions: 12, date: 'Apr 16, 2026' },
]

function InventorySnapshot() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {INVENTORY_ITEMS.map(item => {
        const widthPct = (item.count / INVENTORY_MAX) * 100
        if (item.dashed) {
          return (
            <div
              key={item.label}
              className="relative flex items-center justify-between pl-4 pr-6 h-[52px] rounded-lg border border-dashed border-border"
              style={{ width: `${widthPct}%` }}
            >
              <span className={cn('font-sans font-medium text-sm flex-1 min-w-0', item.textColor)}>{item.label}</span>
              <span className="font-sans font-medium text-sm text-foreground shrink-0 whitespace-nowrap">{item.count}</span>
            </div>
          )
        }
        return (
          <div
            key={item.label}
            className="relative flex items-center justify-between pl-4 pr-6 h-[52px] rounded-lg"
            style={{ width: `${widthPct}%` }}
          >
            <div
              className={cn('absolute inset-0 bg-gradient-to-r rounded-lg', item.gradient)}
              style={{ opacity: item.opacity! }}
            />
            <span className={cn('relative font-sans font-medium text-sm flex-1 min-w-0 z-10', item.textColor)}>{item.label}</span>
            <span className="relative font-sans font-medium text-sm text-foreground shrink-0 whitespace-nowrap z-10">{item.count}</span>
          </div>
        )
      })}
    </div>
  )
}

function SkuPriceChart() {
  const CHART_H = 192
  const REF_LINE_BOTTOM = 112

  return (
    <div className="flex flex-col gap-6">
      {/* Min → Max */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-sans font-normal text-xs text-foreground/60 tracking-[1.08px] uppercase leading-none">Min Price USD</span>
          <span className="font-rubik font-normal text-[36px] text-foreground leading-none">{SKU_PRICE_MIN.toFixed(2)}</span>
        </div>
        <div className="w-6 h-px bg-foreground/40 shrink-0 self-end mb-1" />
        <div className="flex flex-col gap-2">
          <span className="font-sans font-normal text-xs text-foreground/60 tracking-[1.08px] uppercase leading-none">Max Price USD</span>
          <span className="font-rubik font-normal text-[36px] text-foreground leading-none">{SKU_PRICE_MAX.toFixed(2)}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative w-full" style={{ height: CHART_H }}>
        {/* Bars */}
        <div className="absolute inset-y-0 left-0 right-12 flex items-end justify-between gap-[6px]">
          {/* Dashed reference line */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-border pointer-events-none"
            style={{ bottom: REF_LINE_BOTTOM }}
          />
          {SKU_PRICE_BARS.map((h, i) => {
            const isHighlighted = i === SKU_PRICE_HIGHLIGHTED
            return (
              <div key={i} className="relative flex flex-col justify-end flex-1 h-full">
                {isHighlighted && (
                  <div
                    className="absolute size-2 rounded-full bg-background z-10"
                    style={{ top: CHART_H - h + 6, left: '50%', transform: 'translateX(-50%)' }}
                  />
                )}
                <div
                  className={cn('w-full rounded-[4px]', isHighlighted ? 'bg-[var(--green)]' : 'bg-[var(--green)]/50')}
                  style={{ height: h }}
                />
              </div>
            )
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute right-0 top-0 bottom-0 w-10 flex flex-col justify-between items-end">
          {['15,99', '14,99', '14,10', '13,99', '0'].map(label => (
            <span key={label} className="font-sans text-xs font-medium text-foreground/60 leading-none">{label}</span>
          ))}
        </div>

        {/* Tooltip — right edge, centered on reference line */}
        <div
          className="absolute right-0 translate-y-1/2 bg-foreground text-background text-sm font-sans font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10"
          style={{ bottom: REF_LINE_BOTTOM }}
        >
          $14,50
        </div>
      </div>
    </div>
  )
}

function ShelfPositionDotChart() {
  const CHART_H = 209

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full" style={{ height: CHART_H }}>
        {/* Horizontal grid lines */}
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <div
            key={n}
            className="absolute left-0 right-6 border-t border-dashed border-border"
            style={{ bottom: `${((n - 1) / 6) * 100}%` }}
          >
            <span className="absolute right-0 font-sans text-xs font-medium text-foreground/60 leading-none -translate-y-1/2">{n}</span>
          </div>
        ))}
        {/* Vertical dividers */}
        <div className="absolute top-0 bottom-0 w-px" style={{ left: '31.65%', background: 'repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px)' }} />
        <div className="absolute top-0 bottom-0 w-px" style={{ left: '66.73%', background: 'repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px)' }} />
        {/* Dots */}
        {SHELF_DOTS.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[var(--green)]/25 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ width: dot.outer, height: dot.outer, left: `${dot.x * 100}%`, bottom: `${((dot.yVal - 1) / 6) * 100}%` }}
          >
            <div className="rounded-full bg-[var(--green)]" style={{ width: dot.inner, height: dot.inner }} />
          </div>
        ))}
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between pr-6 font-sans text-sm font-medium text-foreground/60">
        <span>Left</span>
        <span>Mid</span>
        <span>Right</span>
      </div>
    </div>
  )
}

function ShelfPositionList() {
  return (
    <div className="flex flex-col w-full">
      {SHELF_LIST.map((item, i) => (
        <div
          key={item.name}
          className={cn(
            'flex items-center justify-between py-3',
            i < SHELF_LIST.length - 1 && 'border-b border-dashed border-border'
          )}
        >
          <span className="font-sans font-normal text-base text-foreground leading-none">{item.name}</span>
          <span className="font-sans font-normal text-base text-foreground/60 leading-none">{item.pct}%</span>
        </div>
      ))}
    </div>
  )
}

export function CampaignDetailPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [storeView, setStoreView] = useState<'grid' | 'list'>('list')

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="flex flex-col p-8 w-full">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/campaign-hub')}
            className="flex items-center justify-center size-8 rounded-full border border-border bg-background hover:bg-accent transition-colors shrink-0"
          >
            <ChevronLeft className="size-4 text-foreground" />
          </button>
          <h1 className="font-sans font-medium text-2xl text-foreground leading-8">
            Raley's, Nob Hill, Bel Air
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 items-center border-b border-border w-full">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-4 text-sm font-sans whitespace-nowrap transition-colors',
                activeTab === tab
                  ? 'border-b-[2.5px] border-foreground -mb-px font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-[38px] items-start w-full mt-[38px]">

          {/* Store info */}
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-[10px]">
              <span className="font-sans font-semibold text-xl text-foreground leading-7">The Corner Market</span>
              <ChevronDown className="size-4 text-foreground shrink-0" />
            </div>
            <div className="flex items-center gap-[10px]">
              <MapPinIcon className="opacity-50 shrink-0" />
              <span className="font-sans font-normal text-sm text-foreground opacity-50 leading-5">
                2660 San Miguel Drive, Newport Beach, CA, US - 92660
              </span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="flex items-stretch gap-4 w-full">
            {STAT_CARDS.map(({ label, value, icon: Icon, iconColor }) => (
              <div key={label} className="relative flex flex-1 flex-col justify-between h-[113px] p-4 rounded-2xl border border-border drop-shadow-[0px_2px_1px_var(--shadow)] bg-card min-w-0">
                <Icon className={cn('absolute top-[15px] right-4 size-4 shrink-0', iconColor)} />
                <div className="flex flex-1 flex-col items-start justify-between">
                  <span className="font-sans font-medium text-sm text-foreground leading-5">{label}</span>
                  <span className="font-rubik font-normal text-[36px] text-foreground leading-none">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SKU pricing table */}
          <div className="flex flex-col w-full rounded-2xl overflow-hidden drop-shadow-[0px_2px_1px_var(--shadow)] bg-card">
            <div className="flex items-center gap-6 px-6 py-3 border border-border rounded-t-2xl">
              <div className="w-[221px] shrink-0">
                <span className="font-sans font-medium text-xs text-muted-foreground uppercase leading-none">SKU Name</span>
              </div>
              {['min price', 'common price', 'max price', '% on sale', 'common sale price'].map(col => (
                <div key={col} className="flex-1 min-w-0">
                  <span className="font-sans font-medium text-xs text-muted-foreground uppercase leading-none whitespace-nowrap">{col}</span>
                </div>
              ))}
            </div>
            {SKU_ROWS.map(row => (
              <div key={row.id} className="flex items-center gap-6 px-6 py-5 border-t border-l border-r border-border last:border-b last:rounded-b-2xl">
                <div className="flex items-center gap-[14px] w-[221px] shrink-0">
                  <div className="size-[31px] rounded-[4px] border border-black/5 overflow-hidden shrink-0">
                    <img src={row.image} alt={row.name} className="size-full object-cover" />
                  </div>
                  <span className="font-sans font-medium text-sm text-foreground leading-snug underline decoration-dotted flex-1 min-w-0">{row.name}</span>
                </div>
                {[row.minPrice, row.commonPrice, row.maxPrice, row.onSale].map((val, i) => (
                  <div key={i} className="flex-1 min-w-0">
                    <span className="font-sans font-medium text-sm text-muted-foreground leading-none">{val}</span>
                  </div>
                ))}
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-medium text-sm text-muted-foreground leading-none underline decoration-dotted">{row.commonSalePrice}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SKU Insights */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="font-sans font-medium text-lg text-foreground leading-none">SKU Insights</span>
              <button className="flex items-center gap-1.5 text-sm font-sans text-foreground border border-border rounded-full px-3 py-1.5 hover:bg-accent transition-colors">
                <span>Mango Spark - 6 pack Bottles</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* Inventory Snapshot + SKU Price */}
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-6 flex-1 bg-card border border-border rounded-2xl p-6 drop-shadow-[0px_2px_1px_var(--shadow)]">
                <span className="font-sans font-semibold text-base text-foreground leading-none">Inventory Snapshot</span>
                <div className="h-px w-full bg-border" />
                <InventorySnapshot />
              </div>
              <div className="flex flex-col gap-6 flex-1 bg-card border border-border rounded-2xl p-6 drop-shadow-[0px_2px_1px_var(--shadow)]">
                <span className="font-sans font-semibold text-base text-foreground leading-none">SKU Price</span>
                <div className="h-px w-full bg-border" />
                <SkuPriceChart />
              </div>
            </div>

            {/* Shelf Position Breakdown */}
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-6 flex-1 bg-card border border-border rounded-2xl p-6 drop-shadow-[0px_2px_1px_var(--shadow)]">
                <span className="font-sans font-semibold text-base text-foreground leading-none">Shelf Position Breakdown</span>
                <div className="h-px w-full bg-border" />
                <ShelfPositionDotChart />
              </div>
              <div className="flex flex-col gap-6 flex-1 bg-card border border-border rounded-2xl p-6 drop-shadow-[0px_2px_1px_var(--shadow)]">
                <span className="font-sans font-semibold text-base text-foreground leading-none">Shelf Position Breakdown</span>
                <div className="h-px w-full bg-border" />
                <ShelfPositionList />
              </div>
            </div>
          </div>

          {/* Store list */}
          <div className="w-full">
            <div className="relative bg-card border border-border rounded-2xl drop-shadow-[0px_2px_1px_var(--shadow)] pt-6 px-6 pb-3">
              {/* Title */}
              <span className="font-sans font-semibold text-base text-foreground leading-none">Shelf Position Breakdown</span>
              {/* View toggle — top right */}
              <div className="absolute top-3 right-6 flex items-center bg-secondary p-0.5 rounded-full">
                <button
                  onClick={() => setStoreView('grid')}
                  className={cn('size-8 flex items-center justify-center rounded-full transition-colors', storeView === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}
                >
                  <TableProperties className="size-4 text-foreground" />
                </button>
                <button
                  onClick={() => setStoreView('list')}
                  className={cn('size-8 flex items-center justify-center rounded-full transition-colors', storeView === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}
                >
                  <Map className="size-4 text-foreground" />
                </button>
              </div>
              {/* Divider */}
              <div className="h-px w-full bg-border mt-4" />
              {/* Rows */}
              {STORE_ROWS.map((store, i) => (
                <div
                  key={store.name}
                  className={cn('flex flex-col gap-2 py-4', i < STORE_ROWS.length - 1 && 'border-b border-dashed border-border')}
                >
                  <span className="font-sans font-normal text-base text-foreground leading-none">{store.name}</span>
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-2 shrink-0">
                      <MapPinIcon className="shrink-0" />
                      <span className="font-sans font-normal text-base text-muted-foreground leading-none">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <NotepadText className="size-5 text-muted-foreground shrink-0" />
                      <span className="font-sans font-normal text-base text-muted-foreground leading-none">{store.submissions} Submissions</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
                      <span className="font-sans font-normal text-base text-[var(--green)] leading-none whitespace-nowrap">Last Submission {store.date}</span>
                      <Check className="size-5 text-[var(--green)] shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
