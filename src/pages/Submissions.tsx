import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  Archive, ChevronDown, CircleCheck, ChevronsDown, CircleDashed, FileDown,
  FlagTriangleRight, Forward, LayoutGrid, LayoutList, Check, Link,
  Search, Sheet, SlidersHorizontal, StickyNote, Upload, X,
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

type BadgeVariant = 'flagged' | 'notes' | 'no-stock' | 'low-stock'
const BADGE_ORDER: BadgeVariant[] = ['flagged', 'notes', 'no-stock', 'low-stock']
const sortBadges = (badges: BadgeVariant[]) =>
  [...badges].sort((a, b) => BADGE_ORDER.indexOf(a) - BADGE_ORDER.indexOf(b))

const BADGE_CONFIG: Record<BadgeVariant, {
  label: string
  wrapperClass: string
  Icon: React.ElementType
}> = {
  flagged: {
    label: 'Flagged',
    wrapperClass: 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground',
    Icon: FlagTriangleRight,
  },
  notes: {
    label: 'Notes',
    wrapperClass: 'bg-gradient-to-r from-soft-indigo to-brighter text-soft-indigo-foreground',
    Icon: StickyNote,
  },
  'no-stock': {
    label: 'No Stock',
    wrapperClass: 'bg-card text-foreground',
    Icon: CircleDashed,
  },
  'low-stock': {
    label: 'Low Stock',
    wrapperClass: 'bg-gradient-to-r from-soft-amber to-brighter text-soft-amber-foreground',
    Icon: ChevronsDown,
  },
}

function Badge({ variant }: { variant: BadgeVariant }) {
  const { label, wrapperClass, Icon } = BADGE_CONFIG[variant]
  return (
    <div className={cn(
      'flex items-center gap-1 px-3 py-2.5 rounded-md border border-border text-xs font-semibold whitespace-nowrap shrink-0',
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

const INITIAL_SUBMISSIONS: Submission[] = [
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
  {
    id: '4',
    storeName: "Ralph's Hollywood",
    address: '4800 Hollywood Blvd, Los Angeles, CA, USA 90027',
    image: imgU01,
    badges: ['flagged', 'notes'],
    noteCount: 2,
    imageCount: 9,
    completedAt: 'Apr 15, 2026',
    completedBy: 'Maria',
  },
  {
    id: '5',
    storeName: 'Safeway Burbank',
    address: '1611 W Olive Ave, Burbank, CA, USA 91506',
    image: imgU02,
    badges: ['no-stock'],
    imageCount: 6,
    completedAt: 'Apr 14, 2026',
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
    completedAt: 'Apr 13, 2026',
    completedBy: 'Thomas',
  },
  {
    id: '7',
    storeName: 'Vons West Hollywood',
    address: '8969 Santa Monica Blvd, West Hollywood, CA, USA 90069',
    image: imgU04,
    badges: ['flagged'],
    imageCount: 4,
    completedAt: 'Apr 12, 2026',
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

        <div className="flex items-center gap-1.5 pt-4">
          {sortBadges(submission.badges).map(b => (
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

export function SubmissionsPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)

  const [activeDateRange, setActiveDateRange] = useState('Today')
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
  const batchBtnRef = useRef<HTMLButtonElement>(null)
  const batchDropdownRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const drawerOpen = !!submissionId

  function openDrawerFor(id: string) {
    setActiveSubmissionId(id)
    navigate(`/shelf/detail/${id}`)
  }

  function closeDrawer() {
    navigate('/shelf')
  }

  const showArchived = filterSelections['Display Status']?.includes('Archived') ?? false
  const filteredSubmissions = submissions.filter(s => {
    if (s.archived && !showArchived) return false
    if (!search.trim()) return true
    return (
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    )
  })
  const visibleSubmissions = filteredSubmissions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredSubmissions.length

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
  const [activeSignals, setActiveSignals] = useState<string[]>([])
  const [islandSendOpen, setIslandSendOpen] = useState(false)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [shareOpen, setShareOpen] = useState(false)

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
  const signalBtnRef = useRef<HTMLButtonElement>(null)
  const signalDropdownRef = useRef<HTMLDivElement>(null)
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
      if (
        batchDropdownRef.current && !batchDropdownRef.current.contains(t) &&
        batchBtnRef.current && !batchBtnRef.current.contains(t)
      ) {
        setBatchOpen(false)
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
                    onClick={() => {
                      const isActive = activeSignals.includes(option)
                      setActiveSignals(prev => isActive ? prev.filter(x => x !== option) : [...prev, option])
                      // track signal filter toggle
                      trackEvent('select_filter_shelf', { filter_type: 'signal', value: option, action: isActive ? 'deselect' : 'select' })
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
        <button
          onClick={() => {
            setSearch('')
            setFilterSelections(Object.fromEntries(FILTER_SELECTS.map(k => [k, []])))
            setActiveSignals([])
          }}
          className="h-9 flex items-center px-3 text-sm text-foreground underline hover:opacity-70 transition-opacity shrink-0"
        >
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
                  onClick={() => {
                    if (activeDateRange !== option) {
                      // track date range filter change
                      trackEvent('select_filter_shelf', { filter_type: 'date_range', value: option })
                    }
                    setActiveDateRange(option)
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
                              onClick={e => {
                                e.stopPropagation()
                                const isActive = selected.includes(option)
                                toggleFilterOption(label, option)
                                // track dropdown filter selection
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
        onClose={closeDrawer}
        onArchive={() => {
          if (activeSubmissionId) {
            const snapshot = submissions
            setSubmissions(prev => prev.map(s => s.id === activeSubmissionId ? { ...s, archived: true } : s))
            showToast('Submissions archived successfully', () => setSubmissions(snapshot))
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
