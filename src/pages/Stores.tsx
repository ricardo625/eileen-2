import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '@/lib/clarity'
import { SHELF_SIGNAL_COUNTS, SHELF_SUBMISSION_TOTAL } from '@/pages/Submissions'
import {
  MoveDown, CircleDashed, Check, FlagTriangleRight, StickyNote,
  ChevronDown, Search, Tags, Upload, TableProperties, Map,
  ChevronRight, Sparkles, Plus, Minus, ArrowUpRight, MapPin, Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'
import heatMapImage from '@/assets/heat.png'
import mapImage from '@/assets/map2.png'
import raleysLogo from '@/assets/logos/raleys.png'
import pavilionsLogo from '@/assets/logos/pavilions.png'
import albertsonsLogo from '@/assets/logos/albertsons.png'

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
  submissionId: string
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
    submissionId: '1',
  },
  {
    id: 2, x: 17.4, y: 20.2, color: '#f91616', ring: false,
    name: 'Buena Park Vons',
    address: '8148 La Palma Ave, Buena Park, CA, US - 90620',
    banner: 'VONS',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'Medium', percent: 42 },
    submissionId: '2',
  },
  {
    id: 3, x: 8.7, y: 41.8, color: '#519249', ring: false,
    name: 'Cerritos Albertsons',
    address: '11901 South St, Cerritos, CA, US - 90703',
    banner: 'ALBERTSONS',
    bannerLogo: albertsonsLogo,
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 15 },
    submissionId: '5',
  },
  {
    id: 4, x: 18.0, y: 63.8, color: '#519249', ring: false,
    name: 'Garden Grove Pavilions',
    address: '13200 Chapman Ave, Garden Grove, CA, US - 92840',
    banner: 'PAVILIONS',
    bannerLogo: pavilionsLogo,
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 10 },
    submissionId: '3',
  },
  {
    id: 5, x: 71.3, y: 84.4, color: '#f59e0b', ring: false,
    name: 'Santa Ana Raleys',
    address: '3737 S Bristol St, Santa Ana, CA, US - 92704',
    banner: 'RALEYS',
    bannerLogo: raleysLogo,
    signals: [{ label: 'Promotion', Icon: Tags, variant: 'default' }],
    risk: { label: 'Medium', percent: 42 },
    submissionId: '4',
  },
  {
    id: 6, x: 22.0, y: 12.5, color: '#f91616', ring: false,
    name: "Ralph's Hollywood",
    address: '4800 Hollywood Blvd, Los Angeles, CA, US - 90027',
    banner: "RALPH'S",
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }, { label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Medium', percent: 50 },
    submissionId: '4',
  },
  {
    id: 7, x: 32.0, y: 7.5, color: '#f91616', ring: false,
    name: 'Safeway Burbank',
    address: '1611 W Olive Ave, Burbank, CA, US - 91506',
    banner: 'SAFEWAY',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'Medium', percent: 45 },
    submissionId: '5',
  },
  {
    id: 8, x: 53.0, y: 9.5, color: '#f59e0b', ring: false,
    name: 'Target Pasadena',
    address: '345 S Lake Ave, Pasadena, CA, US - 91101',
    banner: 'TARGET',
    signals: [{ label: 'Low Stock', Icon: MoveDown, variant: 'default' }, { label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Medium', percent: 38 },
    submissionId: '6',
  },
  {
    id: 9, x: 14.0, y: 17.5, color: '#f91616', ring: false,
    name: 'Vons West Hollywood',
    address: '8969 Santa Monica Blvd, West Hollywood, CA, US - 90069',
    banner: 'VONS',
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }],
    risk: { label: 'Medium', percent: 55 },
    submissionId: '7',
  },
  {
    id: 10, x: 83.0, y: 27.0, color: '#519249', ring: false,
    name: 'Stater Bros Pomona',
    address: '1300 E Holt Ave, Pomona, CA, US - 91767',
    banner: 'STATER BROS',
    signals: [{ label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Low', percent: 20 },
    submissionId: '8',
  },
  {
    id: 11, x: 4.0, y: 38.0, color: '#f91616', ring: false,
    name: 'Sprouts Culver City',
    address: '9901 Venice Blvd, Culver City, CA, US - 90232',
    banner: 'SPROUTS',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }, { label: 'Low Stock', Icon: MoveDown, variant: 'default' }],
    risk: { label: 'High', percent: 65 },
    submissionId: '9',
  },
  {
    id: 12, x: 3.5, y: 52.0, color: '#519249', ring: false,
    name: 'Whole Foods El Segundo',
    address: '720 Allied Way, El Segundo, CA, US - 90245',
    banner: 'WHOLE FOODS',
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 12 },
    submissionId: '10',
  },
  {
    id: 13, x: 20.5, y: 22.0, color: '#f91616', ring: true,
    name: "Trader Joe's Silver Lake",
    address: '2738 Hyperion Ave, Los Angeles, CA, US - 90027',
    banner: "TRADER JOE'S",
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }, { label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'High', percent: 72 },
    submissionId: '11',
  },
  {
    id: 14, x: 7.5, y: 57.5, color: '#f59e0b', ring: false,
    name: 'Smart & Final Inglewood',
    address: '3751 Century Blvd, Inglewood, CA, US - 90303',
    banner: 'SMART & FINAL',
    signals: [{ label: 'Low Stock', Icon: MoveDown, variant: 'default' }, { label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Medium', percent: 40 },
    submissionId: '12',
  },
  {
    id: 15, x: 11.0, y: 64.5, color: '#f91616', ring: false,
    name: 'Food 4 Less Compton',
    address: '2115 N Long Beach Blvd, Compton, CA, US - 90221',
    banner: 'FOOD 4 LESS',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'High', percent: 70 },
    submissionId: '13',
  },
  {
    id: 16, x: 3.0, y: 30.0, color: '#f59e0b', ring: false,
    name: "Ralph's Brentwood",
    address: '264 26th St, Santa Monica, CA, US - 90402',
    banner: "RALPH'S",
    signals: [{ label: 'Low Stock', Icon: MoveDown, variant: 'default' }],
    risk: { label: 'Medium', percent: 35 },
    submissionId: '14',
  },
  {
    id: 17, x: 28.0, y: 9.0, color: '#f91616', ring: true,
    name: "Gelson's Studio City",
    address: '11955 Ventura Blvd, Studio City, CA, US - 91604',
    banner: "GELSON'S",
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }, { label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'High', percent: 80 },
    submissionId: '15',
  },
  {
    id: 18, x: 5.5, y: 70.0, color: '#519249', ring: false,
    name: 'Bristol Farms Manhattan Beach',
    address: '1570 Rosecrans Ave, Manhattan Beach, CA, US - 90266',
    banner: 'BRISTOL FARMS',
    signals: [{ label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Low', percent: 18 },
    submissionId: '16',
  },
  {
    id: 19, x: 91.0, y: 44.0, color: '#f59e0b', ring: false,
    name: 'WinCo Foods Fontana',
    address: '14750 Summit Ave, Fontana, CA, US - 92336',
    banner: 'WINCO',
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }, { label: 'Low Stock', Icon: MoveDown, variant: 'default' }],
    risk: { label: 'Medium', percent: 48 },
    submissionId: '17',
  },
  {
    id: 20, x: 40.0, y: 62.0, color: '#f91616', ring: false,
    name: 'Cardenas Anaheim',
    address: '1350 E Lincoln Ave, Anaheim, CA, US - 92805',
    banner: 'CARDENAS',
    signals: [{ label: 'No Stock', Icon: CircleDashed, variant: 'red' }, { label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Medium', percent: 52 },
    submissionId: '18',
  },
  {
    id: 21, x: 7.0, y: 75.0, color: '#f91616', ring: false,
    name: 'Safeway Redondo Beach',
    address: '20 N Catalina Ave, Redondo Beach, CA, US - 90277',
    banner: 'SAFEWAY',
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }],
    risk: { label: 'Medium', percent: 58 },
    submissionId: '19',
  },
  {
    id: 22, x: 11.5, y: 79.0, color: '#f59e0b', ring: false,
    name: 'Target Torrance',
    address: '21731 Hawthorne Blvd, Torrance, CA, US - 90503',
    banner: 'TARGET',
    signals: [{ label: 'Low Stock', Icon: MoveDown, variant: 'default' }, { label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Medium', percent: 42 },
    submissionId: '20',
  },
  {
    id: 23, x: 16.5, y: 88.5, color: '#519249', ring: false,
    name: 'Vons San Pedro',
    address: '1701 S Pacific Ave, San Pedro, CA, US - 90731',
    banner: 'VONS',
    signals: [{ label: 'Good Stock', Icon: Check, variant: 'default' }],
    risk: { label: 'Low', percent: 15 },
    submissionId: '21',
  },
  {
    id: 24, x: 86.0, y: 21.5, color: '#f91616', ring: true,
    name: 'Stater Bros Upland',
    address: '935 W Foothill Blvd, Upland, CA, US - 91786',
    banner: 'STATER BROS',
    signals: [{ label: 'Flagged', Icon: FlagTriangleRight, variant: 'red' }, { label: 'No Stock', Icon: CircleDashed, variant: 'red' }],
    risk: { label: 'High', percent: 75 },
    submissionId: '22',
  },
  {
    id: 25, x: 18.5, y: 8.0, color: '#519249', ring: false,
    name: "Ralph's Encino",
    address: '17212 Ventura Blvd, Encino, CA, US - 91316',
    banner: "RALPH'S",
    signals: [{ label: 'Notes', Icon: StickyNote, variant: 'default' }],
    risk: { label: 'Low', percent: 22 },
    submissionId: '23',
  },
]

const RISK_STYLES: Record<RiskLevel, { badgeFrom: string; badgeText: string; badgeBorder: string; barColor: string }> = {
  High:   { badgeFrom: 'from-soft-red',   badgeText: 'text-soft-red-foreground',   badgeBorder: 'border-soft-red-border',   barColor: 'var(--red)'   },
  Medium: { badgeFrom: 'from-soft-amber', badgeText: 'text-soft-amber-foreground', badgeBorder: 'border-soft-amber-border', barColor: 'var(--amber)' },
  Low:    { badgeFrom: 'from-soft-green', badgeText: 'text-soft-lime-foreground',  badgeBorder: 'border-soft-lime-border',  barColor: 'var(--green)' },
}

function StoreMapPopover({ store, anchorEl, onClose, onLearnMore }: {
  store: StoreDot
  anchorEl: HTMLElement
  onClose: () => void
  onLearnMore: (submissionId: string) => void
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
        transition: 'top 300ms ease-out, left 300ms ease-out',
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
                'flex items-center gap-1 px-3 py-2.5 rounded-md border text-xs font-semibold whitespace-nowrap shrink-0',
                sig.variant === 'red'
                  ? 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground border-soft-red-border'
                  : 'bg-card text-foreground border-border',
              )}
            >
              <sig.Icon className="size-3.5 opacity-40 shrink-0" />
              <span>{sig.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk */}
      <div className="flex flex-col gap-4 px-5 py-4 border-t border-border-alpha">
        <div className="flex items-center gap-4">
          <span className="flex-1 font-sans font-medium text-sm text-card-foreground leading-5">Risk</span>
          <div className={cn('flex items-center px-3 py-1 rounded-md border bg-gradient-to-r to-brighter', riskStyle.badgeFrom, riskStyle.badgeBorder)}>
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
          onClick={() => {
            // track learn more click from the map popover card
            trackEvent('click_learn_more_store_popover', { store_id: store.id, source: 'popover' })
            onLearnMore(store.submissionId)
          }}
          className="w-full h-9 flex items-center justify-center gap-2 border border-black/5 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
        >
          Learn more
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

function MapView({ onLearnMore }: { onLearnMore: (submissionId: string) => void }) {
  const [selected, setSelected] = useState<{ store: StoreDot; el: HTMLElement } | null>(null)
  const [selectedState, setSelectedState] = useState('California')
  const [mapView, setMapView] = useState<'default' | 'heat'>('default')
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false)
  const [stateSearch, setStateSearch] = useState('')
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const stateTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!stateDropdownOpen) return
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (
        stateDropdownRef.current && !stateDropdownRef.current.contains(t) &&
        stateTriggerRef.current && !stateTriggerRef.current.contains(t)
      ) {
        setStateDropdownOpen(false)
        setStateSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [stateDropdownOpen])

  function handleDotClick(e: React.MouseEvent<HTMLButtonElement>, store: StoreDot) {
    e.stopPropagation()
    const el = e.currentTarget
    const isOpening = selected?.store.id !== store.id
    setSelected(prev => prev?.store.id === store.id ? null : { store, el })
    if (isOpening) {
      // track map pin click — fires on open only, not on dismiss
      trackEvent('click_pin_store_map', { store_id: store.id, coord_x: store.x, coord_y: store.y })
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border" style={{ height: 580 }}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `url(${mapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0)',
          opacity: mapView === 'default' ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `url(${heatMapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: mapView === 'heat' ? 1 : 0,
        }}
      />
      {STORE_DOTS.map(dot => {
        const isSelected = selected?.store.id === dot.id
        return (
          <button
            key={dot.id}
            onClick={e => handleDotClick(e, dot)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          >
            {!isSelected && dot.ring && (
              <div
                className="absolute -inset-3 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: dot.color }}
              />
            )}
            <div
              className="size-3.5 rounded-full shadow-sm group-hover:scale-125 transition-transform"
              style={{
                backgroundColor: dot.color,
                boxShadow: !isSelected && dot.ring ? `0 0 0 2px white, 0 0 0 3px ${dot.color}` : undefined,
              }}
            />
          </button>
        )
      })}
      {/* Zoom controls */}
      <div className="absolute top-[18px] right-5 w-9 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] overflow-hidden z-10">
        <Tooltip label="Zoom in">
          <button className="w-full h-9 flex items-center justify-center hover:bg-[var(--secondary-hover)] transition-colors">
            <Plus className="size-6 text-foreground" />
          </button>
        </Tooltip>
        <div className="h-px w-full bg-[#e0e0e5]" />
        <Tooltip label="Zoom out">
          <button className="w-full h-9 flex items-center justify-center hover:bg-[var(--secondary-hover)] transition-colors">
            <Minus className="size-6 text-foreground" />
          </button>
        </Tooltip>
      </div>

      {/* State selector */}
      <div className="absolute left-5 top-[18px] z-20">
        <button
          ref={stateTriggerRef}
          onClick={() => { setStateDropdownOpen(o => !o); setStateSearch('') }}
          className="flex items-center gap-2 h-9 px-3 bg-background border border-input rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-muted transition-colors"
        >
          <MapPin className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground">{selectedState}</span>
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        </button>

        {stateDropdownOpen && (
          <div
            ref={stateDropdownRef}
            className="absolute top-full left-0 mt-2 w-[260px] bg-card border border-sidebar-border rounded-2xl shadow-[0px_4px_14px_0px_var(--shadow)] p-0.5 z-50"
          >
            {/* Search */}
            <div className="p-2">
              <div className="flex items-center gap-2 h-9 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <Search className="size-5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={stateSearch}
                  onChange={e => setStateSearch(e.target.value)}
                  placeholder="Search"
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            {/* List */}
            <div className="max-h-[240px] overflow-y-auto flex flex-col gap-0 pb-1">
              {US_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase())).map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedState(s); setStateDropdownOpen(false); setStateSearch('') }}
                  className={cn(
                    'w-full px-4 py-3 text-left font-poppins font-medium text-sm text-sidebar-primary-foreground transition-colors rounded-[14px]',
                    s === selectedState ? 'bg-accent' : 'hover:bg-accent',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map view mode */}
      <div className="absolute bottom-5 right-5 flex flex-col items-center w-9 py-[6px] gap-[7px] bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] overflow-hidden z-10">
        {/* Active highlight */}
        <div
          className="absolute left-0 w-full h-[38px] bg-secondary transition-all duration-200"
          style={{ top: mapView === 'default' ? 0 : 'auto', bottom: mapView === 'heat' ? 0 : 'auto' }}
        />
        <Tooltip label="Default view">
          <button onClick={() => setMapView('default')} className="relative z-10 flex items-center justify-center size-6">
            <MapPin className={cn('size-6 transition-colors', mapView === 'default' ? 'text-[var(--red)]' : 'text-foreground')} />
          </button>
        </Tooltip>
        <div className="relative z-10 h-px w-full bg-[var(--soft-rose-border,#ffe4e6)] shrink-0" />
        <Tooltip label="Heat map">
          <button onClick={() => setMapView('heat')} className="relative z-10 flex items-center justify-center size-6">
            <Flame className={cn('size-6 transition-colors', mapView === 'heat' ? 'text-[var(--red)]' : 'text-foreground')} />
          </button>
        </Tooltip>
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
  { label: 'Flagged',    count: SHELF_SIGNAL_COUNTS['Flagged']            ?? 0, Icon: FlagTriangleRight, iconClass: 'text-orange-400'       },
  { label: 'No Stock',   count: SHELF_SIGNAL_COUNTS['Out of Stock']       ?? 0, Icon: CircleDashed,      iconClass: 'text-muted-foreground' },
  { label: 'Low Stock',  count: SHELF_SIGNAL_COUNTS['Low Stock']          ?? 0, Icon: MoveDown,          iconClass: 'text-red'              },
  { label: 'Good Stock', count: SHELF_SIGNAL_COUNTS['Good Stock']         ?? 0, Icon: Check,             iconClass: 'text-green'            },
  { label: 'Notes',      count: SHELF_SIGNAL_COUNTS['Notes']              ?? 0, Icon: StickyNote,        iconClass: 'text-muted-foreground' },
  { label: 'Promotion',  count: SHELF_SIGNAL_COUNTS['Promotional Pricing'] ?? 0, Icon: Tags,             iconClass: 'text-orange-400'       },
]

export const SHELF_SIGNAL_TOTAL = SIGNAL_CARDS.reduce((sum, c) => sum + c.count, 0)

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
          <div className={cn('flex items-center gap-1 px-3 py-1 rounded-md border bg-gradient-to-r to-brighter', rs.badgeFrom, rs.badgeBorder)}>
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
          style={{ background: 'radial-gradient(ellipse at 92% 88%, var(--soft-red) 0%, var(--card) 100%)' }}
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
        ? 'text-foreground underline decoration-dotted underline-offset-4'
        : 'text-muted-foreground',
      isLinked && !isName && 'underline decoration-dotted underline-offset-4',
    )}>
      {String(value)}
    </span>
  )
}

const RECENT_SEARCHES = [
  'Albertsons',
  'Vons Anaheim',
  'Pavilions Pasadena',
  'Safeway Long Beach',
  "Raley's Sacramento",
]

const STORE_SIGNAL_TO_SHELF: Record<string, string> = {
  'Flagged':   'Flagged',
  'No Stock':  'Out of Stock',
  'Low Stock': 'Low Stock',
  'Good Stock':'Good Stock',
  'Notes':     'Notes',
  'Promotion': 'Promotional Pricing',
}

export function StoresPage({ onLearnMore, onNavigateToShelf }: { onLearnMore?: (submissionId: string) => void; onNavigateToShelf?: () => void }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'table' | 'map'>('table')

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredRows = search.trim()
    ? ROWS.filter(r => r.banner.toLowerCase().includes(search.toLowerCase()))
    : ROWS
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
          <Tooltip label="Export">
            <button className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors">
              <Upload className="size-4 text-foreground" />
            </button>
          </Tooltip>
          <button className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors">
            <span>25 per page</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center p-0.5 bg-secondary rounded-full">
            <Tooltip label="Table view">
              <button
                onClick={() => setView('table')}
                className={cn(
                  'size-8 flex items-center justify-center rounded-full transition-colors',
                  view === 'table' ? 'bg-brighter shadow-sm' : 'hover:bg-accent',
                )}
              >
                <TableProperties className={cn('size-4', view === 'table' ? 'text-foreground' : 'text-muted-foreground')} />
              </button>
            </Tooltip>
            <Tooltip label="Map view">
              <button
                onClick={() => setView('map')}
                className={cn(
                  'size-8 flex items-center justify-center rounded-full transition-colors',
                  view === 'map' ? 'bg-brighter shadow-sm' : 'hover:bg-accent',
                )}
              >
                <Map className={cn('size-4', view === 'map' ? 'text-foreground' : 'text-muted-foreground')} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div ref={searchWrapperRef} className="flex-1 relative">
          <div className={cn(
              'flex items-center gap-2 h-9 px-3 bg-background border-b overflow-hidden transition-colors',
              searchFocused ? 'border-[#eb978a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]' : 'border-input',
            )}>
            <Search className="size-4 text-muted-foreground shrink-0" />
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
        <button
          onClick={() => setSearch('')}
          className="font-sans text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0"
        >
          Clear
        </button>
      </div>

      {/* Signal cards */}
      <div className="grid grid-cols-6 gap-4">
        {SIGNAL_CARDS.map(({ label, count, Icon, iconClass }) => {
          const pct = Math.round((count / SHELF_SUBMISSION_TOTAL) * 100)
          return (
            <button
              key={label}
              onClick={() => {
                trackEvent('interact_signal_store', { store_id: null, signal_type: label, severity: count })
                const shelfSignal = STORE_SIGNAL_TO_SHELF[label]
                navigate(shelfSignal ? `/shelf?signal=${encodeURIComponent(shelfSignal)}` : '/shelf')
              }}
              className="relative flex flex-col justify-between h-[113px] p-4 bg-card border border-border rounded-2xl shadow-[0px_2px_2px_0px_var(--shadow)] text-left hover:bg-accent transition-colors"
            >
              <div className="flex flex-col flex-1 justify-between">
                <span className="font-sans font-light text-xs text-foreground leading-none">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-medium text-xl leading-7 text-foreground">{count}</span>
                  <span className="font-sans text-sm text-green leading-none">({pct}%)</span>
                </div>
              </div>
              <Icon className={cn('absolute top-4 right-4 size-4', iconClass)} />
            </button>
          )
        })}
      </div>

      {view === 'map' ? (
        <MapView onLearnMore={id => onLearnMore?.(id)} />
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
            {filteredRows.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <img src="https://www.figma.com/api/mcp/asset/d8837dbf-801d-4d35-9390-d176b4a144b7" alt="" className="size-[120px] dark:hidden" />
                <img src="https://www.figma.com/api/mcp/asset/e5fc148b-4217-4586-90af-038c05bbc1af" alt="" className="size-[120px] hidden dark:block" />
                <p className="text-sm text-muted-foreground">No matched banners</p>
              </div>
            )}
            {filteredRows.map((row, i) => (
              <div
                key={row.banner}
                className={cn(
                  'flex items-center gap-4 px-6 py-5 border-t border-border-alpha transition-colors hover:bg-accent/60 cursor-pointer',
                  i === 0 && 'border-t-0',
                )}
                onClick={() => onNavigateToShelf?.()}
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
