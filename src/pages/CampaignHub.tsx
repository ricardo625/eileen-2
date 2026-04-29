import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type CampaignStatus = 'Active' | 'Completed' | 'Draft'

interface Campaign {
  id: string
  title: string
  subtitle: string
  status: CampaignStatus
  stats: { label: string; value: string }[]
}

const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: "Raley's, Nob Hill, Bel Air",
    subtitle: 'Apr 10, 2026 – Jul 10, 2026 · shelf_audit',
    status: 'Active',
    stats: [
      { label: 'Resolved Reports', value: '120' },
      { label: 'Responses', value: '12/12' },
      { label: 'Remaining Days', value: '182' },
    ],
  },
  {
    id: '2',
    title: "Raley's, Nob Hill, Bel Air",
    subtitle: 'Apr 10, 2026 – Jul 10, 2026 · shelf_audit',
    status: 'Completed',
    stats: [
      { label: 'Resolved Issues', value: '120' },
      { label: 'Responses', value: '100/100' },
      { label: 'Remaining Days', value: '0' },
    ],
  },
  {
    id: '3',
    title: "Raley's, Nob Hill, Bel Air",
    subtitle: 'Apr 10, 2026 – Jul 10, 2026 · shelf_audit',
    status: 'Draft',
    stats: [
      { label: 'Resolved Issues', value: '0/0' },
      { label: 'Responses', value: '0/0' },
      { label: 'Remaining Days', value: '200' },
    ],
  },
]

const STATUS_TABS = ['All', 'Active', 'Completed', 'Draft'] as const
type StatusTab = (typeof STATUS_TABS)[number]

function StatusBadge({ status }: { status: CampaignStatus }) {
  if (status === 'Active') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--soft-green)] to-[var(--brighter)] border border-soft-green-border shrink-0">
        <span className="size-2 rounded-full bg-green shrink-0" />
        <span className="font-sans font-semibold text-xs text-green leading-4 whitespace-nowrap">Active</span>
      </div>
    )
  }
  if (status === 'Completed') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brighter)] border border-[rgba(0,0,0,0.05)] shrink-0">
        <span className="size-2 rounded-full bg-muted-foreground shrink-0" />
        <span className="font-sans font-semibold text-xs text-muted-foreground leading-4 whitespace-nowrap">Completed</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--brighter)] border border-dashed border-border shrink-0">
      <span className="font-sans font-semibold text-xs text-muted-foreground leading-4 whitespace-nowrap">Draft</span>
    </div>
  )
}

function StatPanel({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex flex-col bg-muted rounded-2xl p-4 w-[171px] h-full shrink-0">
      <div className="flex flex-1 flex-col justify-between items-start">
        <span className="font-sans font-light text-xs text-foreground leading-none">{label}</span>
        <div className="flex items-center shrink-0">
          <span className={cn(
            'font-rubik font-normal text-3xl leading-none whitespace-nowrap',
            active ? 'text-green' : 'text-muted-foreground'
          )}>
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}

function CampaignCard({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) {
  const isActive = campaign.status === 'Active'
  const isDraft = campaign.status === 'Draft'

  return (
    <div onClick={onClick} className={cn(
      'flex items-stretch gap-[10px] rounded-2xl p-[10px] border bg-card drop-shadow-[0px_2px_1px_var(--shadow)] cursor-pointer hover:shadow-md transition-shadow',
      isDraft ? 'border-dashed border-border' : 'border-border'
    )}>
      {/* Left section */}
      <div className="flex flex-1 h-full items-center min-w-0 p-[10px]">
        <div className="flex flex-col gap-8 items-start justify-center shrink-0">
          {/* Title + subtitle */}
          <div className="flex flex-col gap-1.5 items-start">
            <span className="font-sans font-semibold text-lg text-foreground leading-none whitespace-nowrap">
              {campaign.title}
            </span>
            <span className="font-sans font-normal text-sm text-muted-foreground leading-5 whitespace-nowrap">
              {campaign.subtitle}
            </span>
          </div>
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      {/* Stat panels */}
      <div className="flex items-stretch gap-[10px] shrink-0">
        {campaign.stats.map((stat) => (
          <StatPanel key={stat.label} label={stat.label} value={stat.value} active={isActive} />
        ))}
      </div>
    </div>
  )
}

export function CampaignHubPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<StatusTab>('All')
  const [search, setSearch] = useState('')

  const filtered = CAMPAIGNS.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="flex flex-col gap-4 p-8 w-full">

        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-poppins font-medium text-2xl text-foreground leading-tight">Campaign Hub</h1>
          <div className="flex items-center gap-2">
            <button className="h-9 flex items-center gap-1.5 px-3 rounded-xl border border-border bg-background text-sm font-poppins text-foreground hover:bg-accent transition-colors">
              <span>25 per page</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
            <button className="h-9 flex items-center gap-1.5 px-4 rounded-xl bg-foreground text-background text-sm font-poppins font-medium hover:opacity-90 transition-opacity">
              <Plus className="size-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>

        {/* Search + sort + clear row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by store name, banner, city and state."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-10 pr-3 rounded-full border border-input bg-background text-sm font-sans text-foreground placeholder:text-muted-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors"
            />
          </div>
          <button className="h-9 flex items-center gap-2 px-3 rounded-full border border-input bg-background text-sm font-sans text-foreground shadow-xs hover:bg-accent transition-colors shrink-0">
            <span>Newest First</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => { setSearch(''); setActiveTab('All') }}
            className="h-9 flex items-center px-3 rounded-full bg-background text-sm font-sans text-foreground shadow-xs hover:bg-accent transition-colors shrink-0 underline"
          >
            Clear
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-[10px]">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'h-10 px-[14px] rounded-full text-sm font-sans transition-colors',
                activeTab === tab
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-background border border-input text-foreground shadow-xs hover:bg-accent'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaign list */}
        <div className="flex flex-col gap-3 items-stretch mt-6">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm font-poppins">
              No campaigns found.
            </div>
          ) : (
            filtered.map(c => <CampaignCard key={c.id} campaign={c} onClick={() => navigate(`/campaign-hub/${c.id}`)} />)
          )}
        </div>

      </div>
    </div>
  )
}
