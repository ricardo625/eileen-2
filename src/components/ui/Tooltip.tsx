import { cn } from '@/lib/utils'

interface TooltipProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <div className={cn('relative group', className)}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-darker text-brighter text-xs font-medium rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[500]">
        {label}
      </div>
    </div>
  )
}
