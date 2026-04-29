import { Ban, ChevronsDown, FlagTriangleRight, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'flagged' | 'notes' | 'no-stock' | 'low-stock'

export const BADGE_CONFIG: Record<BadgeVariant, {
  label: string
  wrapperClass: string
  borderClass: string
  Icon: React.ElementType
}> = {
  flagged: {
    label: 'Flagged',
    wrapperClass: 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground',
    borderClass: 'border-soft-red-border',
    Icon: FlagTriangleRight,
  },
  notes: {
    label: 'Notes',
    wrapperClass: 'bg-brighter text-foreground',
    borderClass: 'border-[var(--border-alpha)]',
    Icon: StickyNote,
  },
  'no-stock': {
    label: 'No Stock',
    wrapperClass: 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground',
    borderClass: 'border-soft-red-border',
    Icon: Ban,
  },
  'low-stock': {
    label: 'Low Stock',
    wrapperClass: 'bg-gradient-to-r from-soft-amber to-brighter text-soft-amber-foreground',
    borderClass: 'border-soft-amber-border',
    Icon: ChevronsDown,
  },
}

export const BADGE_ORDER: BadgeVariant[] = ['flagged', 'notes', 'no-stock', 'low-stock']

export const sortBadges = (badges: BadgeVariant[]) =>
  [...badges].sort((a, b) => BADGE_ORDER.indexOf(a) - BADGE_ORDER.indexOf(b))

export function SignalBadge({ variant, className }: { variant: BadgeVariant; className?: string }) {
  const { label, wrapperClass, borderClass, Icon } = BADGE_CONFIG[variant]
  return (
    <div className={cn(
      'flex items-center gap-1 px-3 py-2.5 rounded-md border text-xs font-semibold whitespace-nowrap shrink-0',
      wrapperClass,
      borderClass,
      className,
    )}>
      <Icon className={cn('size-3.5 shrink-0', variant !== 'flagged' && 'opacity-40')} />
      {variant !== 'flagged' && <span>{label}</span>}
    </div>
  )
}
