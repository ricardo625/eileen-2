import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { STORE_RISK_MAP } from '@/lib/storeRiskMap'
import { createPortal } from 'react-dom'
import {
  Archive, BarChart3, Barcode, Calendar, ChevronDown, CircleCheck,
  FileDown, FlagTriangleRight, Forward,
  LayoutGrid, LayoutList, Check, Link, Package, Search, Sheet,
  SlidersHorizontal, StickyNote, Truck, Upload, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/clarity'
import { SubmissionDrawer } from '@/components/SubmissionDrawer'
import { ToastStack, type ToastItem } from '@/components/ui/Toast'
import { ShareDialog } from '@/components/ShareDialog'
import { Tooltip } from '@/components/ui/Tooltip'

const imgStore1 = 'https://www.figma.com/api/mcp/asset/9025c9da-709d-4f18-9a81-41c33a7b83e0'
const imgStore2 = 'https://www.figma.com/api/mcp/asset/3b9ad25a-73bf-4493-8225-d2d38ff0dc54'
const imgStore3 = 'https://www.figma.com/api/mcp/asset/8373099e-bda5-4eaa-91b1-4c2bac4c2c66'

// Unsplash store shelf photography
const imgU01 = 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&auto=format&fit=crop'

const imgU02 = 'https://images.unsplash.com/photo-1556767576-cf0a4a80e5b8?w=800&auto=format&fit=crop'
const imgU03 = 'https://images.unsplash.com/photo-1526152505827-d2f3b5b4a52a?w=800&auto=format&fit=crop'
const imgU04 = 'https://images.unsplash.com/photo-1646668947240-a154d4d6c766?w=800&auto=format&fit=crop'
const imgU05 = 'https://images.unsplash.com/photo-1584568694489-f71bdbac55e2?w=800&auto=format&fit=crop'
const imgU06 = 'https://images.unsplash.com/photo-1584957109848-6e04fa733565?w=800&auto=format&fit=crop'
const imgU07 = 'https://images.unsplash.com/photo-1646668946448-c0532e782ba8?w=800&auto=format&fit=crop'
const imgU08 = 'https://images.unsplash.com/photo-1591203930900-5cb0eec7cc30?w=800&auto=format&fit=crop'
const imgU09 = 'https://images.unsplash.com/photo-1702280963878-96d6ab0c4ef5?w=800&auto=format&fit=crop'
const imgU10 = 'https://images.unsplash.com/photo-1767602201214-4517f78136f2?w=800&auto=format&fit=crop'
const imgU11 = 'https://images.unsplash.com/photo-1722639096462-dc586c185186?w=800&auto=format&fit=crop'
const imgU12 = 'https://images.unsplash.com/photo-1722639096482-4e1a805f9b0b?w=800&auto=format&fit=crop'
const imgU13 = 'https://images.unsplash.com/photo-1722639096485-7f48cae22a87?w=800&auto=format&fit=crop'
const imgU14 = 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?w=800&auto=format&fit=crop'
const imgU15 = 'https://images.unsplash.com/photo-1722639096454-1fc2448e5c15?w=800&auto=format&fit=crop'

// Unsplash grocery store photography
const imgG01 = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop'
const imgG02 = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'
const imgG03 = 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&auto=format&fit=crop'
const imgG04 = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop'
const imgG05 = 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&auto=format&fit=crop'
const imgG06 = 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&auto=format&fit=crop'
const imgG07 = 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?w=800&auto=format&fit=crop'
const imgG08 = 'https://images.unsplash.com/photo-1540340061722-9293d5163008?w=800&auto=format&fit=crop'
const imgG09 = 'https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?w=800&auto=format&fit=crop'
const imgG10 = 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&auto=format&fit=crop'
const imgG11 = 'https://images.unsplash.com/photo-1545186182-9faaf78480b8?w=800&auto=format&fit=crop'
const imgG12 = 'https://images.unsplash.com/photo-1628102491629-778571d893a3?w=800&auto=format&fit=crop'
const imgG13 = 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop'
const imgG14 = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop'
const imgG15 = 'https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?w=800&auto=format&fit=crop'
const imgG16 = 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=800&auto=format&fit=crop'
const imgG17 = 'https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?w=800&auto=format&fit=crop'
const imgG18 = 'https://images.unsplash.com/photo-1521566652839-697aa473761a?w=800&auto=format&fit=crop'

import { SignalBadge, type BadgeVariant, sortBadges } from '@/components/SignalBadge'

interface Submission {
  id: string
  storeName: string
  address: string
  image: string
  badges: BadgeVariant[]
  badgeCounts?: Partial<Record<BadgeVariant, number>>
  archived?: boolean
  imageCount?: number
  completedAt?: string
  completedBy?: string
  completedAvatar?: string
  noteCount?: number
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    storeName: 'Albertsons Newport Beach',
    address: '2660 San Miguel Dr, Newport Beach, CA, USA 92660',
    image: imgStore1,
    badges: ['flagged', 'notes', 'no-stock'],
    badgeCounts: { 'no-stock': 3, notes: 4 },
    noteCount: 4,
    imageCount: 13,
    completedAt: 'Apr 28, 2026',
    completedBy: 'Jaqueline',
  },
  {
    id: '2',
    storeName: 'Vons Buena Park',
    address: '8148 La Palma Ave, Buena Park, CA, USA 90620',
    image: imgStore2,
    badges: ['notes', 'low-stock'],
    badgeCounts: { 'low-stock': 2, notes: 2 },
    noteCount: 2,
    archived: true,
    imageCount: 7,
    completedAt: 'Apr 27, 2026',
    completedBy: 'Marcus',
  },
  {
    id: '3',
    storeName: 'Pavilions Garden Grove',
    address: '13200 Chapman Ave, Garden Grove, CA, USA 92840',
    image: imgStore3,
    badges: ['out-of-stock'],
    badgeCounts: { 'out-of-stock': 4 },
    imageCount: 5,
    completedAt: 'Apr 26, 2026',
    completedBy: 'Sara',
  },
  {
    id: '4',
    storeName: "Ralph's Hollywood",
    address: '4800 Hollywood Blvd, Los Angeles, CA, USA 90027',
    image: imgU01,
    badges: ['flagged', 'notes'],
    noteCount: 2,
    imageCount: 9,
    completedAt: 'Apr 25, 2026',
    completedBy: 'Maria',
  },
  {
    id: '5',
    storeName: 'Safeway Burbank',
    address: '1611 W Olive Ave, Burbank, CA, USA 91506',
    image: imgU02,
    badges: ['out-of-stock'],
    imageCount: 6,
    completedAt: 'Apr 24, 2026',
    completedBy: 'David',
  },
  {
    id: '6',
    storeName: 'Target Pasadena',
    address: '345 S Lake Ave, Pasadena, CA, USA 91101',
    image: imgU03,
    badges: ['low-stock', 'notes'],
    noteCount: 3,
    imageCount: 11,
    completedAt: 'Apr 23, 2026',
    completedBy: 'Thomas',
  },
  {
    id: '7',
    storeName: 'Vons West Hollywood',
    address: '8969 Santa Monica Blvd, West Hollywood, CA, USA 90069',
    image: imgU04,
    badges: ['flagged'],
    imageCount: 4,
    completedAt: 'Apr 22, 2026',
    completedBy: 'Emma',
  },
  {
    id: '8',
    storeName: 'Stater Bros Pomona',
    address: '1300 E Holt Ave, Pomona, CA, USA 91767',
    image: imgU05,
    badges: ['notes'],
    noteCount: 3,
    imageCount: 8,
    completedAt: 'Apr 11, 2026',
    completedBy: 'Carlos',
  },
  {
    id: '9',
    storeName: 'Sprouts Culver City',
    address: '9901 Venice Blvd, Culver City, CA, USA 90232',
    image: imgU06,
    badges: ['no-stock', 'low-stock'],
    imageCount: 7,
    completedAt: 'Apr 10, 2026',
    completedBy: 'Ashley',
  },
  {
    id: '10',
    storeName: 'Whole Foods El Segundo',
    address: '720 Allied Way, El Segundo, CA, USA 90245',
    image: imgU07,
    badges: [],
    imageCount: 10,
    completedAt: 'Apr 9, 2026',
    completedBy: 'Jordan',
  },
  {
    id: '11',
    storeName: "Trader Joe's Silver Lake",
    address: '2738 Hyperion Ave, Los Angeles, CA, USA 90027',
    image: imgU08,
    badges: ['flagged', 'no-stock'],
    imageCount: 5,
    completedAt: 'Apr 8, 2026',
    completedBy: 'Priya',
  },
  {
    id: '12',
    storeName: 'Smart & Final Inglewood',
    address: '3751 Century Blvd, Inglewood, CA, USA 90303',
    image: imgU09,
    badges: ['notes', 'low-stock'],
    noteCount: 2,
    imageCount: 6,
    completedAt: 'Apr 7, 2026',
    completedBy: 'Kevin',
  },
  {
    id: '13',
    storeName: 'Food 4 Less Compton',
    address: '2115 N Long Beach Blvd, Compton, CA, USA 90221',
    image: imgU10,
    badges: ['no-stock'],
    archived: true,
    imageCount: 4,
    completedAt: 'Apr 6, 2026',
    completedBy: 'Lisa',
  },
  {
    id: '14',
    storeName: "Ralph's Brentwood",
    address: '264 26th St, Santa Monica, CA, USA 90402',
    image: imgU11,
    badges: ['low-stock'],
    imageCount: 8,
    completedAt: 'Apr 5, 2026',
    completedBy: 'Maria',
  },
  {
    id: '15',
    storeName: "Gelson's Studio City",
    address: '11955 Ventura Blvd, Studio City, CA, USA 91604',
    image: imgU12,
    badges: ['flagged', 'notes', 'no-stock'],
    noteCount: 5,
    imageCount: 14,
    completedAt: 'Apr 4, 2026',
    completedBy: 'David',
  },
  {
    id: '16',
    storeName: 'Bristol Farms Manhattan Beach',
    address: '1570 Rosecrans Ave, Manhattan Beach, CA, USA 90266',
    image: imgU13,
    badges: ['notes'],
    noteCount: 1,
    imageCount: 6,
    completedAt: 'Apr 3, 2026',
    completedBy: 'Thomas',
  },
  {
    id: '17',
    storeName: 'WinCo Foods Fontana',
    address: '14750 Summit Ave, Fontana, CA, USA 92336',
    image: imgU14,
    badges: ['low-stock', 'flagged'],
    imageCount: 9,
    completedAt: 'Apr 2, 2026',
    completedBy: 'Emma',
  },
  {
    id: '18',
    storeName: 'Cardenas Anaheim',
    address: '1350 E Lincoln Ave, Anaheim, CA, USA 92805',
    image: imgU15,
    badges: ['no-stock', 'notes'],
    noteCount: 2,
    imageCount: 7,
    completedAt: 'Apr 1, 2026',
    completedBy: 'Carlos',
  },
  {
    id: '19',
    storeName: 'Safeway Redondo Beach',
    address: '20 N Catalina Ave, Redondo Beach, CA, USA 90277',
    image: imgU03,
    badges: ['flagged'],
    imageCount: 5,
    completedAt: 'Mar 31, 2026',
    completedBy: 'Ashley',
  },
  {
    id: '20',
    storeName: 'Target Torrance',
    address: '21731 Hawthorne Blvd, Torrance, CA, USA 90503',
    image: imgU06,
    badges: ['notes', 'low-stock'],
    noteCount: 4,
    imageCount: 11,
    completedAt: 'Mar 30, 2026',
    completedBy: 'Jordan',
  },
  {
    id: '21',
    storeName: 'Vons San Pedro',
    address: '1701 S Pacific Ave, San Pedro, CA, USA 90731',
    image: imgU09,
    badges: [],
    imageCount: 3,
    completedAt: 'Mar 29, 2026',
    completedBy: 'Priya',
  },
  {
    id: '22',
    storeName: 'Stater Bros Upland',
    address: '935 W Foothill Blvd, Upland, CA, USA 91786',
    image: imgU11,
    badges: ['no-stock', 'flagged'],
    archived: true,
    imageCount: 6,
    completedAt: 'Mar 28, 2026',
    completedBy: 'Kevin',
  },
  {
    id: '23',
    storeName: "Ralph's Encino",
    address: '17212 Ventura Blvd, Encino, CA, USA 91316',
    image: imgU14,
    badges: ['notes'],
    noteCount: 3,
    imageCount: 8,
    completedAt: 'Mar 27, 2026',
    completedBy: 'Lisa',
  },
  {
    id: '24',
    storeName: 'Kroger Riverside',
    address: '3400 Central Ave, Riverside, CA, USA 92506',
    image: imgG01,
    badges: ['flagged', 'notes'],
    noteCount: 3,
    imageCount: 10,
    completedAt: 'Mar 26, 2026',
    completedBy: 'Maria',
  },
  {
    id: '25',
    storeName: 'Whole Foods Westwood',
    address: '1050 Gayley Ave, Los Angeles, CA, USA 90024',
    image: imgG02,
    badges: [],
    imageCount: 6,
    completedAt: 'Mar 25, 2026',
    completedBy: 'David',
  },
  {
    id: '26',
    storeName: "Trader Joe's South Pasadena",
    address: '1000 Fremont Ave, South Pasadena, CA, USA 91030',
    image: imgG03,
    badges: ['low-stock'],
    imageCount: 7,
    completedAt: 'Mar 24, 2026',
    completedBy: 'Thomas',
  },
  {
    id: '27',
    storeName: 'Safeway Woodland Hills',
    address: '21035 Clarendon St, Woodland Hills, CA, USA 91367',
    image: imgG04,
    badges: ['notes', 'no-stock'],
    noteCount: 2,
    imageCount: 9,
    completedAt: 'Mar 23, 2026',
    completedBy: 'Emma',
  },
  {
    id: '28',
    storeName: 'Target Glendale',
    address: '201 E Magnolia Blvd, Burbank, CA, USA 91502',
    image: imgG05,
    badges: ['flagged'],
    imageCount: 5,
    completedAt: 'Mar 22, 2026',
    completedBy: 'Carlos',
  },
  {
    id: '29',
    storeName: "Ralph's Mar Vista",
    address: '12035 Venice Blvd, Los Angeles, CA, USA 90066',
    image: imgG06,
    badges: ['no-stock', 'low-stock'],
    imageCount: 8,
    completedAt: 'Mar 21, 2026',
    completedBy: 'Ashley',
  },
  {
    id: '30',
    storeName: 'Pavilions Arcadia',
    address: '400 N Santa Anita Ave, Arcadia, CA, USA 91006',
    image: imgG07,
    badges: ['notes'],
    noteCount: 1,
    imageCount: 6,
    completedAt: 'Mar 20, 2026',
    completedBy: 'Jordan',
  },
  {
    id: '31',
    storeName: 'Albertsons Downey',
    address: '9001 Firestone Blvd, Downey, CA, USA 90241',
    image: imgG08,
    badges: ['flagged', 'notes', 'no-stock'],
    noteCount: 4,
    imageCount: 12,
    completedAt: 'Mar 19, 2026',
    completedBy: 'Priya',
  },
  {
    id: '32',
    storeName: 'Smart & Final Hawthorne',
    address: '4601 W El Segundo Blvd, Hawthorne, CA, USA 90250',
    image: imgG09,
    badges: ['low-stock'],
    imageCount: 5,
    completedAt: 'Mar 18, 2026',
    completedBy: 'Kevin',
  },
  {
    id: '33',
    storeName: 'Sprouts Sherman Oaks',
    address: '14919 Ventura Blvd, Sherman Oaks, CA, USA 91403',
    image: imgG10,
    badges: [],
    imageCount: 4,
    completedAt: 'Mar 17, 2026',
    completedBy: 'Lisa',
  },
  {
    id: '34',
    storeName: 'Food 4 Less Bell Gardens',
    address: '6400 Eastern Ave, Bell Gardens, CA, USA 90201',
    image: imgG11,
    badges: ['no-stock', 'flagged'],
    archived: true,
    imageCount: 7,
    completedAt: 'Mar 16, 2026',
    completedBy: 'Maria',
  },
  {
    id: '35',
    storeName: 'Vons Chatsworth',
    address: '21821 Devonshire St, Chatsworth, CA, USA 91311',
    image: imgG12,
    badges: ['notes'],
    noteCount: 2,
    imageCount: 6,
    completedAt: 'Mar 15, 2026',
    completedBy: 'David',
  },
  {
    id: '36',
    storeName: 'Stater Bros Rialto',
    address: '285 W Foothill Blvd, Rialto, CA, USA 92376',
    image: imgG13,
    badges: ['low-stock', 'notes'],
    noteCount: 1,
    imageCount: 8,
    completedAt: 'Mar 14, 2026',
    completedBy: 'Thomas',
  },
  {
    id: '37',
    storeName: 'WinCo Foods Ontario',
    address: '1225 W Holt Blvd, Ontario, CA, USA 91762',
    image: imgG14,
    badges: ['flagged'],
    imageCount: 9,
    completedAt: 'Mar 13, 2026',
    completedBy: 'Emma',
  },
  {
    id: '38',
    storeName: 'Bristol Farms Palos Verdes',
    address: '2545 Pacific Coast Hwy, Torrance, CA, USA 90505',
    image: imgG15,
    badges: [],
    imageCount: 5,
    completedAt: 'Mar 12, 2026',
    completedBy: 'Carlos',
  },
  {
    id: '39',
    storeName: "Gelson's Pacific Palisades",
    address: '15424 Sunset Blvd, Pacific Palisades, CA, USA 90272',
    image: imgG16,
    badges: ['notes', 'no-stock'],
    noteCount: 3,
    imageCount: 10,
    completedAt: 'Mar 11, 2026',
    completedBy: 'Ashley',
  },
  {
    id: '40',
    storeName: 'Cardenas Commerce',
    address: '2600 E Olympic Blvd, Los Angeles, CA, USA 90023',
    image: imgG17,
    badges: ['flagged', 'low-stock'],
    imageCount: 7,
    completedAt: 'Mar 10, 2026',
    completedBy: 'Jordan',
  },
  {
    id: '41',
    storeName: 'Smart & Final Covina',
    address: '1175 N Azusa Ave, Covina, CA, USA 91722',
    image: imgG18,
    badges: ['no-stock'],
    imageCount: 6,
    completedAt: 'Mar 9, 2026',
    completedBy: 'Priya',
  },
  {
    id: '42',
    storeName: "Ralph's Northridge",
    address: '19340 Rinaldi St, Northridge, CA, USA 91326',
    image: imgG03,
    badges: ['notes'],
    noteCount: 2,
    imageCount: 7,
    completedAt: 'Mar 8, 2026',
    completedBy: 'Kevin',
  },
  {
    id: '43',
    storeName: 'Safeway Monrovia',
    address: '711 E Huntington Dr, Monrovia, CA, USA 91016',
    image: imgG07,
    badges: ['low-stock', 'flagged'],
    imageCount: 8,
    completedAt: 'Mar 7, 2026',
    completedBy: 'Lisa',
  },
]

const SIGNAL_OPTIONS = [
  'Flagged',
  'Out of Stock',
  'Low Stock',
  'Good Stock',
  'Notes',
  'Missing Product',
  'Promotional Pricing',
]

const RISK_OPTIONS = ['Low Risk', 'Medium Risk', 'High Risk']

const ALL_SIGNAL_OPTIONS = [...SIGNAL_OPTIONS, ...RISK_OPTIONS]

function signalMatches(sig: string, s: Submission): boolean {
  if (sig === 'Flagged')             return s.badges.includes('flagged')
  if (sig === 'Out of Stock')        return s.badges.includes('no-stock')
  if (sig === 'Low Stock')           return s.badges.includes('low-stock')
  if (sig === 'Good Stock')          return !s.badges.includes('no-stock') && !s.badges.includes('low-stock')
  if (sig === 'Notes')               return s.badges.includes('notes')
  if (sig === 'Missing Product')     return cardExtraSignals(s.id).includes('Missing Product')
  if (sig === 'Promotional Pricing') return cardExtraSignals(s.id).includes('Promotional Pricing')
  if (sig === 'Low Risk')            return STORE_RISK_MAP[s.id] === 'Low'
  if (sig === 'Medium Risk')         return STORE_RISK_MAP[s.id] === 'Medium'
  if (sig === 'High Risk')           return STORE_RISK_MAP[s.id] === 'High'
  return false
}

export const SHELF_SIGNAL_COUNTS: Record<string, number> = Object.fromEntries(
  SIGNAL_OPTIONS.map(sig => [sig, INITIAL_SUBMISSIONS.filter(s => signalMatches(sig, s)).length])
)

export const SHELF_SUBMISSION_TOTAL = INITIAL_SUBMISSIONS.length

const RISK_TOTAL = Object.keys(STORE_RISK_MAP).length

const SIGNAL_PCT: Record<string, number> = Object.fromEntries(
  ALL_SIGNAL_OPTIONS.map(sig => {
    const count = INITIAL_SUBMISSIONS.filter(s => signalMatches(sig, s)).length
    const denominator = RISK_OPTIONS.includes(sig) ? RISK_TOTAL : INITIAL_SUBMISSIONS.length
    return [sig, Math.round((count / denominator) * 100)]
  })
)

const DATE_OPTIONS = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'Month to Date',
  'Year to Date',
  'All Time',
]

const FILTER_SELECTS = ['State', 'Acc Manager']

const FILTER_OPTIONS: Record<string, string[]> = {
  'State':          ['CA'],
  'Banner':         ['Albertsons', 'Bel Air Foods', 'Nob Hill Foods', 'Pavilions', "Raley's", 'Vons'],
  'Notes':          ['Additional SKU Found', 'Behind Counter', 'Behind Glass', 'Display Not Found', 'Locked Case', 'Promotional Pricing'],
  'Acc Manager':    ['Direct Shop', 'Distributor', 'Grocery DC'],
  'Campaign':       ['Your Shelf Check'],
  'Display Status': ['All', 'Found', 'Not Found', 'Archived'],
}

// Deterministic per-card metadata derived from submission id
const BANNERS    = FILTER_OPTIONS['Banner']
const ACC_MGRS   = FILTER_OPTIONS['Acc Manager']
const NOTE_TYPES = FILTER_OPTIONS['Notes']

function cardBanner(id: string)      { return BANNERS[(parseInt(id) - 1) % BANNERS.length] }
function cardAccManager(id: string)  { return ACC_MGRS[(parseInt(id) - 1) % ACC_MGRS.length] }
function cardNoteTypes(id: string, noteCount?: number): string[] {
  if (!noteCount) return []
  const i = parseInt(id) - 1
  return [NOTE_TYPES[i % NOTE_TYPES.length], NOTE_TYPES[(i + 2) % NOTE_TYPES.length]]
}
function cardSkuCount(id: string): number {
  const n = parseInt(id)
  return 4 + (n % 9)
}
function cardDisplayStatus(id: string): 'Found' | 'Not Found' {
  return parseInt(id) % 3 === 0 ? 'Not Found' : 'Found'
}
function cardExtraSignals(id: string): string[] {
  const n = parseInt(id)
  const out: string[] = []
  if (n % 5 === 0) out.push('Missing Product')
  if (n % 7 === 0) out.push('Promotional Pricing')
  return out
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
          ? 'border-2 border-primary bg-gradient-to-b from-[rgba(249,185,175,0.35)] to-[rgba(255,255,255,0.35)] dark:from-muted dark:to-muted'
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

        {/* SKUs row */}
        <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-foreground">
          <span className="flex-1">SKUs</span>
          <span className="text-right">{cardSkuCount(submission.id)}</span>
        </div>

        <div className="flex items-center gap-1.5 pt-4">
          {sortBadges(submission.badges).map(b => (
            b === 'notes' && submission.noteCount
              ? <Tooltip key={b} label={`${submission.noteCount} note${submission.noteCount !== 1 ? 's' : ''}`}><SignalBadge variant={b} count={submission.badgeCounts?.[b]} /></Tooltip>
              : <SignalBadge key={b} variant={b} count={submission.badgeCounts?.[b]} />
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
          ? 'border-2 border-primary bg-gradient-to-b from-[rgba(249,185,175,0.35)] to-[rgba(255,255,255,0.35)] dark:from-muted dark:to-muted'
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
          {sortBadges(submission.badges).map(b => (
            b === 'notes' && submission.noteCount
              ? <Tooltip key={b} label={`${submission.noteCount} note${submission.noteCount !== 1 ? 's' : ''}`}><SignalBadge variant={b} count={submission.badgeCounts?.[b]} /></Tooltip>
              : <SignalBadge key={b} variant={b} count={submission.badgeCounts?.[b]} />
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

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getCalDays(year: number, month: number): { date: Date; outOfMonth: boolean }[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const days: { date: Date; outOfMonth: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), outOfMonth: true })
  for (let d = 1; d <= daysInMonth; d++) days.push({ date: new Date(year, month, d), outOfMonth: false })
  const rem = days.length % 7
  if (rem > 0) for (let d = 1; d <= 7 - rem; d++) days.push({ date: new Date(year, month + 1, d), outOfMonth: true })
  return days
}

function addMonth(ym: { year: number; month: number }, delta: number) {
  let m = ym.month + delta
  let y = ym.year
  while (m > 11) { m -= 12; y++ }
  while (m < 0) { m += 12; y-- }
  return { year: y, month: m }
}

function isInRange(date: Date, start: Date | null, end: Date | null, hover: Date | null) {
  if (!start) return false
  const eff = end ?? hover
  if (!eff || isSameDay(start, eff)) return false
  const lo = start < eff ? start : eff
  const hi = start < eff ? eff : start
  return date > lo && date < hi
}

function isRangeEdge(date: Date, start: Date | null, end: Date | null, hover: Date | null, side: 'start' | 'end') {
  if (!start) return false
  const eff = end ?? hover
  const lo = eff && start > eff ? eff : start
  const hi = eff && start > eff ? start : eff
  if (side === 'start') return isSameDay(date, lo)
  return !!hi && !isSameDay(start, hi) && isSameDay(date, hi)
}

export function SubmissionsPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const [activeDateRange, setActiveDateRange] = useState('Last 30 Days')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [cal1, setCal1] = useState(() => { const now = new Date(); return { year: now.getFullYear(), month: now.getMonth() } })
  const [cal2, setCal2] = useState(() => { const now = new Date(); return addMonth({ year: now.getFullYear(), month: now.getMonth() }, 1) })
  const [openFilterSelect, setOpenFilterSelect] = useState<string | null>(null)
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>(
    Object.fromEntries(FILTER_SELECTS.map(k => [k, []]))
  )
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(submissionId ?? null)
  const [batch, setBatch] = useState(12)
  const [visibleCount, setVisibleCount] = useState(12)
  const [batchOpen, setBatchOpen] = useState(false)
  const [activeSignals, setActiveSignals] = useState<string[]>(() => {
    const sig = searchParams.get('signal')
    return sig && SIGNAL_OPTIONS.includes(sig) ? [sig] : []
  })
  const [openPillDropdown, setOpenPillDropdown] = useState<string | null>(null)
  const [islandSendOpen, setIslandSendOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [shareOpen, setShareOpen] = useState(false)
  const batchBtnRef = useRef<HTMLButtonElement>(null)
  const batchDropdownRef = useRef<HTMLDivElement>(null)
  const pillDropdownRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchParams.has('signal')) {
      setSearchParams(p => { p.delete('signal'); return p }, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawerOpen = !!submissionId

  function openDrawerFor(id: string) {
    setActiveSubmissionId(id)
    navigate(`/shelf/detail/${id}`)
    const submission = submissions.find(s => s.id === id)
    trackEvent('open_shelf_drawer', {
      card_id: id,
      store_name: submission?.storeName ?? null,
      badges: (submission?.badges ?? []).join(','),
    })
  }

  function closeDrawer() {
    navigate('/shelf')
  }

  const filteredSubmissions = submissions.filter(s => {
    // --- Display Status ---
    const dsFilter = filterSelections['Display Status'] ?? []
    if (dsFilter.length === 0) {
      if (s.archived) return false
    } else if (!dsFilter.includes('All')) {
      const status = s.archived ? 'Archived' : cardDisplayStatus(s.id)
      if (!dsFilter.includes(status)) return false
    }

    // --- Search ---
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.storeName.toLowerCase().includes(q) && !s.address.toLowerCase().includes(q)) return false
    }

    // --- Banner ---
    const bannerFilter = filterSelections['Banner'] ?? []
    if (bannerFilter.length > 0 && !bannerFilter.includes(cardBanner(s.id))) return false

    // --- Notes ---
    const notesFilter = filterSelections['Notes'] ?? []
    if (notesFilter.length > 0) {
      const types = cardNoteTypes(s.id, s.noteCount)
      if (!notesFilter.some(n => types.includes(n))) return false
    }

    // --- Acc Manager ---
    const accFilter = filterSelections['Acc Manager'] ?? []
    if (accFilter.length > 0 && !accFilter.includes(cardAccManager(s.id))) return false

    // --- Campaign (all cards belong to 'Your Shelf Check') ---
    const campFilter = filterSelections['Campaign'] ?? []
    if (campFilter.length > 0 && !campFilter.includes('Your Shelf Check')) return false

    // --- Signals ---
    if (activeSignals.length > 0) {
      const matches = activeSignals.some(sig => signalMatches(sig, s))
      if (!matches) return false
    }

    // --- Date Range ---
    if (activeDateRange !== 'All Time') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const submDate = s.completedAt ? (() => { const d = new Date(s.completedAt); return new Date(d.getFullYear(), d.getMonth(), d.getDate()) })() : null
      if (!submDate) return false
      if (activeDateRange === 'Today') {
        if (submDate.getTime() !== today.getTime()) return false
      } else if (activeDateRange === 'Last 7 Days') {
        const cutoff = new Date(today); cutoff.setDate(today.getDate() - 6)
        if (submDate < cutoff || submDate > today) return false
      } else if (activeDateRange === 'Last 30 Days') {
        const cutoff = new Date(today); cutoff.setDate(today.getDate() - 29)
        if (submDate < cutoff || submDate > today) return false
      } else if (activeDateRange === 'Month to Date') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        if (submDate < start || submDate > today) return false
      } else if (activeDateRange === 'Year to Date') {
        const start = new Date(today.getFullYear(), 0, 1)
        if (submDate < start || submDate > today) return false
      } else if (activeDateRange === 'Custom') {
        if (customRange.start) {
          const start = new Date(customRange.start.getFullYear(), customRange.start.getMonth(), customRange.start.getDate())
          if (submDate < start) return false
        }
        if (customRange.end) {
          const end = new Date(customRange.end.getFullYear(), customRange.end.getMonth(), customRange.end.getDate())
          if (submDate > end) return false
        }
      }
    }

    return true
  })
  const visibleSubmissions = filteredSubmissions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredSubmissions.length

  const toggleFilterOption = (select: string, option: string) =>
    setFilterSelections(prev => {
      const cur = prev[select] ?? []
      return {
        ...prev,
        [select]: cur.includes(option) ? cur.filter(x => x !== option) : [...cur, option],
      }
    })

  const toggleSelected = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev)
      const selecting = !next.has(id)
      selecting ? next.add(id) : next.delete(id)
      if (selecting) {
        const submission = submissions.find(s => s.id === id)
        trackEvent('select_card_shelf', { card_id: id, store_name: submission?.storeName ?? null })
      }
      return next
    })
  function showToast(msg: string, onUndo?: () => void) {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message: msg, onUndo }])
  }

  function dismissToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function triggerExport(successMsg: string) {
    let cancelled = false
    const tid = setTimeout(() => {
      if (!cancelled) showToast(successMsg, () => {})
    }, 1800)
    showToast('Preparing the file...', () => { cancelled = true; clearTimeout(tid) })
  }
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const datePillRef = useRef<HTMLButtonElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const islandSendBtnRef = useRef<HTMLButtonElement>(null)
  const islandSendDropdownRef = useRef<HTMLDivElement>(null)

  // Reset visible count when filters, search, or batch size change
  useEffect(() => { setVisibleCount(batch) }, [search, filterSelections, activeSignals, batch])

  // Infinite scroll: load next batch when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleCount(c => c + batch)
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore])

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
        islandSendDropdownRef.current && !islandSendDropdownRef.current.contains(t) &&
        islandSendBtnRef.current && !islandSendBtnRef.current.contains(t)
      ) {
        setIslandSendOpen(false)
      }
      if (
        batchDropdownRef.current && !batchDropdownRef.current.contains(t) &&
        batchBtnRef.current && !batchBtnRef.current.contains(t)
      ) {
        setBatchOpen(false)
      }
      if (pillDropdownRef.current && !pillDropdownRef.current.contains(t)) {
        setOpenPillDropdown(null)
      }
      if (
        datePickerRef.current && !datePickerRef.current.contains(t) &&
        datePillRef.current && !datePillRef.current.contains(t)
      ) {
        setDatePickerOpen(false)
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
          {selectedIds.size > 0 && (
            <span className="text-sm text-[var(--red)] whitespace-nowrap">Selected {selectedIds.size}</span>
          )}
          <Tooltip label="Select all">
            <button
              onClick={() =>
                setSelectedIds(prev =>
                  prev.size === submissions.length
                    ? new Set()
                    : new Set(submissions.map(s => s.id))
                )
              }
              className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <CircleCheck className={cn('size-4 transition-colors', selectedIds.size === submissions.length ? 'text-[#f91616]' : 'text-foreground')} />
            </button>
          </Tooltip>
          <div className="w-px h-5 bg-border shrink-0" />
          <Tooltip label="Export CSV">
            <button
              onClick={() => {
                // track header export button click
                trackEvent('click_export_shelf', { format: 'csv', source: 'header', selected_count: selectedIds.size })
                triggerExport('Exported to CSV successfully')
              }}
              disabled={selectedIds.size === 0}
              className="size-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Upload className="size-4 text-foreground" />
            </button>
          </Tooltip>
          <div className="relative">
            <button
              ref={batchBtnRef}
              onClick={() => setBatchOpen(o => !o)}
              className="h-9 flex items-center gap-2 px-3 bg-background border border-input rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm text-foreground hover:bg-accent transition-colors"
            >
              <span>{batch} per scroll</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
            {batchOpen && (
              <div
                ref={batchDropdownRef}
                className="absolute right-0 top-full mt-1 w-[160px] bg-card border border-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-50 flex flex-col"
              >
                {[10, 12, 25, 50].map(size => (
                  <button
                    key={size}
                    onClick={() => { setBatch(size); setBatchOpen(false) }}
                    className={cn(
                      'flex items-center h-9 px-4 rounded-xl text-sm transition-colors text-left',
                      batch === size ? 'text-foreground font-medium' : 'text-muted-foreground hover:bg-accent',
                    )}
                  >
                    {size} per scroll
                  </button>
                ))}
              </div>
            )}
          </div>
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

      {/* Search */}
      <div ref={searchWrapperRef} className="relative">
        <div className="flex items-center gap-1 h-9 px-3 bg-background border-b border-input overflow-hidden">
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

      {/* Filter pills */}
      <div className="relative flex items-center gap-2.5">
        {/* All */}
        <button
          onClick={() => {
            setSearch('')
            setFilterSelections(Object.fromEntries(FILTER_SELECTS.map(k => [k, []])))
            setActiveSignals([])
            setActiveDateRange('Today')
            setCustomRange({ start: null, end: null })
          }}
          className={cn(
            'h-10 flex items-center px-3.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors shrink-0',
            activeSignals.length === 0 && Object.values(filterSelections).every(a => a.length === 0)
              ? 'bg-darker text-brighter'
              : 'bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
          )}
        >
          All
        </button>

        {/* Date range picker */}
        <div className="relative shrink-0">
          <button
            ref={datePillRef}
            onClick={() => setDatePickerOpen(o => !o)}
            className={cn(
              'h-10 flex items-center gap-2 px-3 rounded-full text-sm whitespace-nowrap transition-colors',
              activeDateRange !== 'All Time'
                ? 'bg-darker text-brighter'
                : 'bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
            )}
          >
            <Calendar className="size-4 shrink-0" />
            {activeDateRange === 'Custom' && customRange.start
              ? customRange.end
                ? `${customRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${customRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : customRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : activeDateRange}
          </button>

          {datePickerOpen && (
            <div
              ref={datePickerRef}
              className="absolute top-full left-0 mt-2 bg-card border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-3 flex gap-3 z-50"
            >
              {/* Preset list */}
              <div className="flex flex-col p-0.5 w-[180px] drop-shadow-[0px_4px_14px_var(--shadow)]">
                {DATE_OPTIONS.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => {
                      setActiveDateRange(option)
                      setCustomRange({ start: null, end: null })
                      trackEvent('select_filter_shelf', { filter_type: 'date_range', value: option })
                    }}
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

              {/* Dual-month calendar */}
              <div className="flex gap-4 py-3">
                {[cal1, cal2].map((ym, calIdx) => {
                  const days = getCalDays(ym.year, ym.month)
                  const weeks: typeof days[] = []
                  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

                  return (
                    <div key={calIdx} className="flex flex-col gap-4">
                      {/* Calendar header */}
                      <div className="relative flex items-center justify-between">
                        {calIdx === 0 && (
                          <button
                            onClick={() => { setCal1(p => addMonth(p, -1)); setCal2(p => addMonth(p, -1)) }}
                            className="absolute left-0 size-8 flex items-center justify-center rounded-md bg-card opacity-50 hover:opacity-100 transition-opacity"
                          >
                            <ChevronDown className="size-4 rotate-90" />
                          </button>
                        )}
                        <div className={cn('flex gap-1.5 items-center', calIdx === 0 ? 'pl-10' : 'pr-10')}>
                          <select
                            value={ym.month}
                            onChange={e => {
                              const m = parseInt(e.target.value)
                              if (calIdx === 0) { setCal1({ year: ym.year, month: m }); setCal2(addMonth({ year: ym.year, month: m }, 1)) }
                              else { setCal2({ year: ym.year, month: m }); setCal1(addMonth({ year: ym.year, month: m }, -1)) }
                            }}
                            className="h-[34px] px-2 py-1.5 bg-card border border-input rounded-md text-sm text-foreground shadow-xs appearance-none pr-6 cursor-pointer"
                          >
                            {MONTHS.map((mn, mi) => <option key={mn} value={mi}>{mn.slice(0, 3)}</option>)}
                          </select>
                          <select
                            value={ym.year}
                            onChange={e => {
                              const y = parseInt(e.target.value)
                              if (calIdx === 0) { setCal1({ year: y, month: ym.month }); setCal2(addMonth({ year: y, month: ym.month }, 1)) }
                              else { setCal2({ year: y, month: ym.month }); setCal1(addMonth({ year: y, month: ym.month }, -1)) }
                            }}
                            className="h-[34px] px-2 py-1.5 bg-card border border-input rounded-md text-sm text-foreground shadow-xs appearance-none pr-6 cursor-pointer"
                          >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                        {calIdx === 1 && (
                          <button
                            onClick={() => { setCal1(p => addMonth(p, 1)); setCal2(p => addMonth(p, 1)) }}
                            className="absolute right-0 size-8 flex items-center justify-center rounded-md bg-card opacity-50 hover:opacity-100 transition-opacity"
                          >
                            <ChevronDown className="size-4 -rotate-90" />
                          </button>
                        )}
                      </div>

                      {/* Day headers */}
                      <div className="flex flex-col gap-2">
                        <div className="flex">
                          {DAY_HEADERS.map(h => (
                            <div key={h} className="size-8 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Day rows */}
                        {weeks.map((week, wi) => (
                          <div key={wi} className="flex">
                            {week.map((cell, di) => {
                              const { date, outOfMonth } = cell
                              const isStart = isRangeEdge(date, customRange.start, customRange.end, hoverDate, 'start')
                              const isEnd = isRangeEdge(date, customRange.start, customRange.end, hoverDate, 'end')
                              const inRange = isInRange(date, customRange.start, customRange.end, hoverDate)
                              const isToday = isSameDay(date, new Date())

                              return (
                                <button
                                  key={di}
                                  onClick={() => {
                                    if (!customRange.start || (customRange.start && customRange.end)) {
                                      setCustomRange({ start: date, end: null })
                                      setActiveDateRange('Custom')
                                    } else {
                                      const s = customRange.start
                                      const e = date
                                      setCustomRange(s <= e ? { start: s, end: e } : { start: e, end: s })
                                      setActiveDateRange('Custom')
                                    }
                                  }}
                                  onMouseEnter={() => setHoverDate(date)}
                                  onMouseLeave={() => setHoverDate(null)}
                                  className={cn(
                                    'size-8 flex items-center justify-center text-sm transition-colors',
                                    outOfMonth && 'opacity-50',
                                    (isStart || isEnd) && 'rounded-md',
                                    inRange && !isStart && !isEnd && 'bg-accent',
                                    isStart && 'rounded-l-md',
                                    isEnd && 'rounded-r-md',
                                    !isStart && !isEnd && !inRange && !outOfMonth && 'hover:bg-accent rounded-md',
                                    isToday && !isStart && !isEnd && 'font-medium',
                                    outOfMonth ? 'text-muted-foreground' : 'text-foreground',
                                  )}
                                >
                                  {(isStart || isEnd) ? (
                                    <span className="size-8 flex items-center justify-center bg-darker text-brighter rounded-md text-sm">
                                      {date.getDate()}
                                    </span>
                                  ) : date.getDate()}
                                </button>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Flagged */}
        <button
          onClick={() => {
            const isActive = activeSignals.includes('Flagged')
            setActiveSignals(prev => isActive ? prev.filter(x => x !== 'Flagged') : [...prev, 'Flagged'])
            trackEvent('select_filter_shelf', { filter_type: 'signal', value: 'Flagged', action: isActive ? 'deselect' : 'select' })
          }}
          className={cn(
            'h-10 flex items-center gap-2 px-3 rounded-full text-sm whitespace-nowrap transition-colors shrink-0',
            activeSignals.includes('Flagged')
              ? 'bg-darker text-brighter'
              : 'bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
          )}
        >
          <FlagTriangleRight className="size-4 shrink-0" />
          Flagged
        </button>

        {/* Notes */}
        <button
          onClick={() => {
            const isActive = activeSignals.includes('Notes')
            setActiveSignals(prev => isActive ? prev.filter(x => x !== 'Notes') : [...prev, 'Notes'])
            trackEvent('select_filter_shelf', { filter_type: 'signal', value: 'Notes', action: isActive ? 'deselect' : 'select' })
          }}
          className={cn(
            'h-10 flex items-center gap-2 px-3 rounded-full text-sm whitespace-nowrap transition-colors shrink-0',
            activeSignals.includes('Notes')
              ? 'bg-darker text-brighter'
              : 'bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
          )}
        >
          <StickyNote className="size-4 shrink-0" />
          Notes
        </button>

        {/* Stock dropdown */}
        {(['Stock', 'Low Risk', 'Campaign', "Sku's"] as const).map(pill => {
          const pillConfig: Record<string, { icon: React.ElementType; signals: string[] }> = {
            'Stock':    { icon: Package,    signals: ['Out of Stock', 'Low Stock', 'Good Stock'] },
            'Low Risk': { icon: BarChart3,  signals: ['Low Risk', 'Medium Risk', 'High Risk'] },
            'Campaign': { icon: Truck,      signals: [] },
            "Sku's":    { icon: Barcode,    signals: [] },
          }
          const cfg = pillConfig[pill]
          const PillIcon = cfg.icon
          const pillSignals = cfg.signals
          const campaignSel = filterSelections['Campaign'] ?? []
          const skuSel = filterSelections['Display Status'] ?? []
          const isActive = pill === 'Campaign'
            ? campaignSel.length > 0
            : pill === "Sku's"
              ? skuSel.length > 0
              : pillSignals.some(s => activeSignals.includes(s))
          const isOpen = openPillDropdown === pill

          return (
            <div key={pill} className="relative shrink-0">
              <button
                onClick={() => setOpenPillDropdown(o => o === pill ? null : pill)}
                className={cn(
                  'h-10 flex items-center gap-2 px-3 rounded-full text-sm whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-darker text-brighter'
                    : 'bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
                )}
              >
                <PillIcon className="size-4 shrink-0" />
                {pill}
                <ChevronDown className="size-4 shrink-0" />
              </button>

              {isOpen && (
                <div
                  ref={pillDropdownRef}
                  className="absolute top-full left-0 mt-2 w-[200px] bg-card border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-0.5 z-50"
                >
                  {pill === 'Campaign'
                    ? (FILTER_OPTIONS['Campaign'] ?? []).map((opt, i) => {
                        const sel = (filterSelections['Campaign'] ?? []).includes(opt)
                        return (
                          <button key={opt} onClick={() => toggleFilterOption('Campaign', opt)}
                            className={cn('w-full flex items-center gap-3 h-11 px-4 text-left transition-colors', i === 0 ? 'rounded-[14px] bg-accent' : 'rounded-full hover:bg-accent')}
                          >
                            <div className={cn('size-4 rounded-[4px] flex items-center justify-center shrink-0', sel ? 'bg-darker shadow-sm' : 'border border-darker/30')}>
                              {sel && <Check className="size-3 text-brighter" />}
                            </div>
                            <span className="font-poppins font-medium text-sm text-sidebar-primary-foreground">{opt}</span>
                          </button>
                        )
                      })
                    : pill === "Sku's"
                      ? (FILTER_OPTIONS['Display Status'] ?? []).map((opt, i) => {
                          const sel = (filterSelections['Display Status'] ?? []).includes(opt)
                          return (
                            <button key={opt} onClick={() => toggleFilterOption('Display Status', opt)}
                              className={cn('w-full flex items-center gap-3 h-11 px-4 text-left transition-colors', i === 0 ? 'rounded-[14px] bg-accent' : 'rounded-full hover:bg-accent')}
                            >
                              <div className={cn('size-4 rounded-[4px] flex items-center justify-center shrink-0', sel ? 'bg-darker shadow-sm' : 'border border-darker/30')}>
                                {sel && <Check className="size-3 text-brighter" />}
                              </div>
                              <span className="font-poppins font-medium text-sm text-sidebar-primary-foreground">{opt}</span>
                            </button>
                          )
                        })
                      : pillSignals.map((opt, i) => {
                          const sel = activeSignals.includes(opt)
                          return (
                            <button key={opt}
                              onClick={() => {
                                setActiveSignals(prev => sel ? prev.filter(x => x !== opt) : [...prev, opt])
                                trackEvent('select_filter_shelf', { filter_type: 'signal', value: opt, action: sel ? 'deselect' : 'select' })
                              }}
                              className={cn('w-full flex items-center gap-3 h-11 px-4 text-left transition-colors', i === 0 ? 'rounded-[14px] bg-accent' : 'rounded-full hover:bg-accent')}
                            >
                              <div className={cn('size-4 rounded-[4px] flex items-center justify-center shrink-0', sel ? 'bg-darker shadow-sm' : 'border border-darker/30')}>
                                {sel && <Check className="size-3 text-brighter" />}
                              </div>
                              <span className="font-poppins font-medium text-sm text-sidebar-primary-foreground">{opt}</span>
                              <span className="ml-auto font-poppins text-sm text-muted-foreground shrink-0">{SIGNAL_PCT[opt]}%</span>
                            </button>
                          )
                        })
                  }
                </div>
              )}
            </div>
          )
        })}

        {/* Full filter panel trigger */}
        <div className="relative shrink-0">
          <button
            ref={filterBtnRef}
            onClick={() => setFilterOpen(o => !o)}
            className="h-9 w-9 flex items-center justify-center bg-secondary text-secondary-foreground rounded-full hover:bg-[var(--secondary-hover)] transition-colors"
          >
            <SlidersHorizontal className="size-4 text-foreground" />
          </button>

          {/* Full filter dropdown */}
          {filterOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 bg-card border border-sidebar-border rounded-2xl shadow-[0px_4px_28px_0px_var(--shadow)] p-3 flex gap-3 z-50"
            >
            {/* Filter selects */}
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
                              onClick={e => {
                                e.stopPropagation()
                                const isActive = selected.includes(option)
                                toggleFilterOption(label, option)
                                trackEvent('select_filter_shelf', { filter_type: label, value: option, action: isActive ? 'deselect' : 'select' })
                              }}
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

        {/* Clear */}
        <button
          onClick={() => {
            setSearch('')
            setFilterSelections(Object.fromEntries(FILTER_SELECTS.map(k => [k, []])))
            setActiveSignals([])
            setActiveDateRange('Today')
          }}
          className="h-9 flex items-center px-3 text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0"
        >
          Clear
        </button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground -mt-3">
        There {filteredSubmissions.length === 1 ? 'is' : 'are'} <span className="font-medium text-foreground">{filteredSubmissions.length}</span> {filteredSubmissions.length === 1 ? 'result' : 'results'} found
      </p>

      {/* Cards / List */}
      {filteredSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 min-h-[400px]">
          <img src="https://www.figma.com/api/mcp/asset/f6eb4b32-3525-4047-96ae-7fa1d23c2dcb" alt="" className="size-[120px] dark:hidden" />
          <img src="https://www.figma.com/api/mcp/asset/e977927e-3031-4146-a73b-69318d7894a0" alt="" className="size-[120px] hidden dark:block" />
          <p className="text-sm text-muted-foreground">No matching submissions</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-3 gap-3 pb-24">
          {visibleSubmissions.map((s, index) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              selected={selectedIds.has(s.id)}
              onToggle={() => toggleSelected(s.id)}
              onOpen={() => {
                trackEvent('click_card_shelf', { card_id: s.id, card_type: 'submission', position: index })
                openDrawerFor(s.id)
              }}
            />
          ))}
          {hasMore && <div ref={sentinelRef} className="h-1 col-span-3" />}
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-24">
          {visibleSubmissions.map((s, index) => (
            <SubmissionListRow
              key={s.id}
              submission={s}
              selected={selectedIds.has(s.id)}
              onToggle={() => toggleSelected(s.id)}
              onOpen={() => {
                trackEvent('click_card_shelf', { card_id: s.id, card_type: 'submission', position: index })
                openDrawerFor(s.id)
              }}
            />
          ))}
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </div>
      )}

      <SubmissionDrawer
        open={drawerOpen}
        cardId={activeSubmissionId}
        submission={submissions.find(s => s.id === activeSubmissionId) ?? null}
        onClose={closeDrawer}
        onArchive={() => {
          if (activeSubmissionId) {
            const snapshot = submissions
            setSubmissions(prev => prev.map(s => s.id === activeSubmissionId ? { ...s, archived: true } : s))
            showToast('Submissions archived successfully', () => setSubmissions(snapshot))
          }
        }}
        onFlag={(flagged) => {
          if (activeSubmissionId) {
            setSubmissions(prev => prev.map(s => {
              if (s.id !== activeSubmissionId) return s
              const badges = (flagged
                ? [...s.badges.filter(b => b !== 'flagged'), 'flagged']
                : s.badges.filter(b => b !== 'flagged')) as typeof s.badges
              return { ...s, badges }
            }))
          }
        }}
      />

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
                  onClick={() => {
                    const allFlagged = [...selectedIds].every(id =>
                      submissions.find(s => s.id === id)?.badges.includes('flagged')
                    )
                    const snapshot = submissions
                    if (allFlagged) {
                      setSubmissions(prev => prev.map(s =>
                        selectedIds.has(s.id)
                          ? { ...s, badges: s.badges.filter(b => b !== 'flagged') }
                          : s
                      ))
                      showToast('Submissions unflagged successfully', () => setSubmissions(snapshot))
                    } else {
                      setSubmissions(prev => prev.map(s =>
                        selectedIds.has(s.id) && !s.badges.includes('flagged')
                          ? { ...s, badges: [...s.badges, 'flagged'] }
                          : s
                      ))
                      showToast('Submissions flagged successfully', () => setSubmissions(snapshot))
                    }
                  }}
                  className={cn(
                    'size-9 flex items-center justify-center rounded-full transition-colors',
                    [...selectedIds].every(id => submissions.find(s => s.id === id)?.badges.includes('flagged'))
                      ? 'bg-gradient-to-r from-soft-red to-brighter'
                      : 'bg-background hover:bg-accent',
                  )}
                >
                  <FlagTriangleRight className={cn('size-4 transition-colors', [...selectedIds].every(id => submissions.find(s => s.id === id)?.badges.includes('flagged')) ? 'text-[#f91616]' : 'text-foreground')} />
                </button>
              </Tooltip>
              <Tooltip label="Archive">
                <button
                  onClick={() => {
                    const snapshot = submissions
                    const restoredIds = new Set(selectedIds)
                    setSubmissions(prev => prev.map(s => selectedIds.has(s.id) ? { ...s, archived: true } : s))
                    setSelectedIds(new Set())
                    showToast('Submissions archived successfully', () => { setSubmissions(snapshot); setSelectedIds(restoredIds) })
                  }}
                  className="size-9 flex items-center justify-center rounded-full bg-background hover:bg-accent transition-colors"
                >
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
                        onClick={() => {
                          setIslandSendOpen(false)
                          if (label === 'Export to PDF') {
                            // track island PDF export
                            trackEvent('click_export_shelf', { format: 'pdf', source: 'island', selected_count: selectedIds.size })
                            triggerExport(msg!)
                          } else if (label === 'Export to CSV') {
                            // track island CSV export
                            trackEvent('click_export_shelf', { format: 'csv', source: 'island', selected_count: selectedIds.size })
                            triggerExport(msg!)
                          } else if (label === 'Share URL') {
                            // track share URL intent from island
                            trackEvent('click_share_url_shelf', { source: 'island', selected_count: selectedIds.size })
                            setShareOpen(true)
                          }
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
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} onCopy={() => {
        // track copy link click inside the share dialog (opened from island)
        trackEvent('click_copy_link_share_shelf', { source: 'island' })
        showToast('Link copied successfully')
      }} />}
    </div>
  )
}
