import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import {
  Bell,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
  Store,
  Truck,
} from 'lucide-react'


interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activePage?: string
  onNavigate?: (page: string) => void
  shelfBadge?: number
}

function EileenLogogram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ '--fill-0': 'var(--brand, #F9B9AF)' } as React.CSSProperties}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4446 9.34824C19.129 8.4692 17.5822 8 16 8V0C19.1645 0 22.2579 0.938384 24.8891 2.69649C27.5203 4.45458 29.571 6.95345 30.7821 9.87704C31.993 12.8006 32.3099 16.0178 31.6926 19.1214C31.0752 22.2251 29.5514 25.0761 27.3137 27.3137C25.0761 29.5514 22.2251 31.0752 19.1214 31.6926C16.0178 32.3099 12.8006 31.993 9.87704 30.7821C6.95345 29.571 4.45458 27.5203 2.69649 24.8891C0.938384 22.2579 0 19.1645 0 16H8C8 17.5822 8.4692 19.129 9.34824 20.4446C10.2273 21.7602 11.4767 22.7855 12.9386 23.391C14.4003 23.9966 16.0089 24.155 17.5607 23.8462C19.1126 23.5376 20.538 22.7757 21.6569 21.6569C22.7757 20.538 23.5376 19.1126 23.8462 17.5607C24.155 16.0089 23.9966 14.4003 23.391 12.9386C22.7855 11.4767 21.7602 10.2273 20.4446 9.34824Z"
        fill="var(--fill-0, #F9B9AF)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.465e-06C8 1.05058 7.79308 2.09087 7.39104 3.06147C6.989 4.03208 6.39972 4.91399 5.65685 5.65686C4.91399 6.39973 4.03208 6.989 3.06147 7.39104C2.09086 7.79308 1.05057 8 3.49688e-07 8L0 16C2.10115 16 4.18172 15.5862 6.12294 14.7821C8.06416 13.978 9.828 12.7994 11.3137 11.3137C12.7994 9.828 13.978 8.06416 14.7821 6.12294C15.5862 4.18172 16 2.10115 16 0L8 3.465e-06Z"
        fill="var(--fill-0, #F9B9AF)"
      />
    </svg>
  )
}

function NavBadge({ count }: { count: number }) {
  return (
    <div className="bg-sidebar-signal border border-sidebar-border flex items-center justify-center rounded-full size-6 shrink-0">
      <span className="text-sidebar-signal-foreground text-xs font-medium font-poppins leading-none">
        {count}
      </span>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number
  hasRedDot?: boolean
  expandable?: boolean
  expanded?: boolean
  collapsed?: boolean
  onClick?: () => void
  subItems?: string[]
  activeSubItem?: string
  onSubItemClick?: (item: string) => void
}

function NavItem({
  icon,
  label,
  active,
  badge,
  hasRedDot,
  expandable,
  expanded,
  collapsed,
  onClick,
  subItems,
  activeSubItem,
  onSubItemClick,
}: NavItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null)

  const showPopover = () => {
    clearTimeout(hideTimer.current)
    if (!collapsed) return
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) setPopoverPos({ top: rect.top, left: rect.right + 4 })
  }

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setPopoverPos(null), 200)
  }

  const themeContainer =
    typeof document !== 'undefined'
      ? (buttonRef.current?.closest<HTMLElement>('[class*="theme-"], .dark') ?? document.body)
      : null

  const hasSubmenu = collapsed && expandable && !!subItems?.length

  return (
    <>
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={showPopover}
      onMouseLeave={scheduleHide}
      className={cn(
        'group relative isolate w-full flex items-center h-11 px-4 rounded-full cursor-pointer text-left',
        collapsed ? 'justify-center' : 'gap-3',
        active && 'bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none'
      )}
    >
      {/* Hover gradient layer */}
      {!active && (
        <span className="absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      )}

      {/* Icon + red dot */}
      <div className="relative shrink-0 size-5 flex items-center justify-center">
        <span
          className={cn(
            'relative size-5 flex items-center justify-center transition-colors duration-150',
            active ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'
          )}
        >
          {icon}
        </span>
        {hasRedDot && (
          <span className="absolute top-0 left-[13px] size-[10px] rounded-full bg-[#f91616] border-2 border-sidebar" />
        )}
      </div>

      {/* Expanded: label, badge, chevron */}
      {!collapsed && (
        <>
          <span
            className={cn(
              'flex-1 font-poppins font-medium text-sm leading-5 whitespace-nowrap overflow-hidden',
              active ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'
            )}
          >
            {label}
          </span>
          {badge !== undefined && <NavBadge count={badge} />}
          {expandable && (
            <span className="opacity-50 size-5 flex items-center justify-center shrink-0 text-sidebar-foreground">
              {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </span>
          )}
        </>
      )}

      {/* Collapsed: tiny chevron hint for expandable items */}
      {collapsed && expandable && (
        <span className="absolute right-0 opacity-25 size-4 flex items-center justify-center text-sidebar-foreground">
          <ChevronRight className="size-3" />
        </span>
      )}
    </button>

    {collapsed && popoverPos && themeContainer && createPortal(
      hasSubmenu ? (
        <div
          className="fixed z-50 w-[159px] bg-sidebar dark:bg-muted border border-sidebar-border rounded-[24px] p-[2px]"
          style={{ top: popoverPos.top, left: popoverPos.left }}
          onMouseEnter={() => clearTimeout(hideTimer.current)}
          onMouseLeave={scheduleHide}
        >
          {subItems!.map(item => {
            const isActive = item === activeSubItem
            return (
              <button
                key={item}
                onClick={() => onSubItemClick?.(item)}
                className={cn(
                  'group relative w-full h-11 min-h-[44px] shrink-0 flex items-center px-4 text-left font-poppins font-medium text-sm whitespace-nowrap',
                  isActive
                    ? 'bg-sidebar-accent rounded-[14px] text-sidebar-foreground'
                    : 'rounded-full text-muted-foreground hover:text-sidebar-accent-foreground'
                )}
              >
                {!isActive && (
                  <span className="absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                )}
                <span className="relative">{item}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div
          className="fixed z-50 pointer-events-none bg-sidebar border border-sidebar-border rounded-full px-2 py-0.5 text-sm text-sidebar-foreground whitespace-nowrap animate-[tooltipIn_150ms_ease-out]"
          style={{ top: popoverPos.top + 22, left: popoverPos.left, transform: 'translateY(-50%)' }}
        >
          {label}
        </div>
      ),
      themeContainer
    )}
    </>
  )
}

function SubNavItem({
  label,
  active,
  collapsed,
  badge,
  onClick,
}: {
  label: string
  active?: boolean
  collapsed?: boolean
  badge?: number
  onClick?: () => void
}) {
  if (collapsed) return null
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative isolate flex items-center h-11 pl-[48px] pr-4 rounded-full w-full cursor-pointer text-left',
        active && 'bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none'
      )}
    >
      {!active && (
        <span className="absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      )}
      <span className={cn(
        'relative flex-1 font-poppins font-medium text-sm leading-5 whitespace-nowrap overflow-hidden',
        active ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'
      )}>
        {label}
      </span>
      {badge !== undefined && <NavBadge count={badge} />}
    </button>
  )
}

export function Sidebar({ collapsed, onToggle, activePage, onNavigate, shelfBadge }: SidebarProps) {
  const [storeInsightsExpanded, setStoreInsightsExpanded] = useState(true)
  const [planProgress, setPlanProgress] = useState(0)

  const activeSubItem = activePage === 'submissions' ? 'The Shelf' : activePage === 'stores' ? 'Stores' : undefined

  useEffect(() => {
    const t = setTimeout(() => setPlanProgress(46), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-full">
      <aside
        className={cn(
          'bg-gradient-to-b from-sidebar to-brighter border border-white dark:border-sidebar-border h-full rounded-2xl shadow-[0px_16px_44px_0px_var(--shadow)] flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[280px]'
        )}
      >
        {/* Dark mode radial glow */}
        <span
          className="hidden dark:block absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 100%)' }}
        />

        {/* Logo */}
        <div className={cn('shrink-0 flex items-center', collapsed ? 'p-5 justify-center' : 'p-6')}>
          {collapsed ? (
            <EileenLogogram className="size-8 shrink-0" />
          ) : (
            <div className="flex items-center gap-2">
              <EileenLogogram className="size-8 shrink-0" />
              <span className="font-poppins font-semibold text-xl leading-snug text-darker whitespace-nowrap">
                Eileen
              </span>
            </div>
          )}
        </div>

        {/* Workspace switcher */}
        <div className={cn('shrink-0', collapsed ? 'px-3' : 'px-6')}>
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>

        {/* Main scrollable area */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden min-h-0 mt-6 sidebar-scroll">
          {/* Primary nav */}
          <nav className={cn('flex flex-col gap-1', collapsed ? 'px-3' : 'px-6')}>
            <NavItem
              icon={<Bell className="size-5" />}
              label="Activity"
              badge={3}
              hasRedDot
              collapsed={collapsed}
            />
            {/* <NavItem
              icon={<Bot className="size-5" />}
              label="Ai.Lean"
              active={activePage === 'ai-lean'}
              collapsed={collapsed}
              onClick={() => onNavigate?.('ai-lean')}
            /> */}

            {/* Store Insights expandable group */}
            <div className="flex flex-col gap-1">
              <NavItem
                icon={<Store className="size-5" />}
                label="Store Insights"
                expandable
                expanded={storeInsightsExpanded}
                collapsed={collapsed}
                onClick={() => setStoreInsightsExpanded(e => !e)}
                subItems={['The Shelf', 'Stores']}
                activeSubItem={activeSubItem}
                onSubItemClick={item => {
                  if (item === 'The Shelf') onNavigate?.('submissions')
                  if (item === 'Stores') onNavigate?.('stores')
                }}
              />
              {storeInsightsExpanded && (
                <>
                  <SubNavItem
                    label="The Shelf"
                    active={activePage === 'submissions'}
                    collapsed={collapsed}
                    onClick={() => onNavigate?.('submissions')}
                  />
                  <SubNavItem
                    label="Stores"
                    active={activePage === 'stores'}
                    collapsed={collapsed}
                    onClick={() => onNavigate?.('stores')}
                  />
                </>
              )}
            </div>

            <NavItem
              icon={<Truck className="size-5" />}
              label="Campaign Hub"
              badge={1}
              active={activePage === 'campaign-hub'}
              collapsed={collapsed}
              onClick={() => onNavigate?.('campaign-hub')}
            />
            <NavItem
              icon={<Layers className="size-5" />}
              label="Brand Management"
              collapsed={collapsed}
            />
          </nav>

          {/* Divider */}
          <div className="border-t border-dashed border-sidebar-border shrink-0" />

          {/* Secondary nav — hidden for now
          <nav className={cn('flex flex-col gap-1', collapsed ? 'px-3' : 'px-6')}>
            <NavItem icon={<Settings className="size-5" />} label="Settings" collapsed={collapsed} />
          </nav> */}

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Plan card */}
        {!collapsed && (
          <div className="shrink-0 px-6 pb-4">
            <div className="bg-sidebar border border-sidebar-border rounded-lg p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-sidebar-foreground whitespace-nowrap overflow-hidden">Starter</p>
                <div className="flex flex-col gap-1">
                  <div className="relative h-1 w-full rounded-full overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-brand opacity-20" />
                    <div className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-1000 ease-out" style={{ width: `${planProgress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-sidebar-foreground">
                    <span className="whitespace-nowrap overflow-hidden">Submissions</span>
                    <span className="font-bold whitespace-nowrap shrink-0">230 of 500</span>
                  </div>
                </div>
              </div>
              <button className="w-full h-8 border border-sidebar-border rounded-lg text-sm text-sidebar-foreground shadow-xs px-3 whitespace-nowrap overflow-hidden">
                Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className={cn(
            'shrink-0 border-t border-sidebar-border flex items-center',
            collapsed ? 'p-5 justify-center' : 'p-6 gap-3'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3 min-w-0',
              collapsed ? 'justify-center' : 'flex-1'
            )}
          >
            <div className="size-10 rounded-full bg-[#ffb31f] flex items-center justify-center shrink-0 overflow-hidden">
              <span className="text-white text-sm font-bold font-poppins">J</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-poppins font-medium text-xs leading-5 text-sidebar-foreground whitespace-nowrap overflow-hidden">
                  Welcome back 👋
                </p>
                <p className="font-poppins font-medium text-sm leading-5 text-foreground whitespace-nowrap overflow-hidden">
                  Johnathan
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="opacity-50 size-5 flex items-center justify-center shrink-0 text-sidebar-foreground">
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      </aside>

      {/* Collapse / expand toggle */}
      <button
        onClick={onToggle}
        className="absolute top-7 -right-3.5 bg-background border border-border rounded-full size-7 flex items-center justify-center shadow-sm z-10"
      >
        {collapsed ? (
          <ChevronRight className="size-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="size-4 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}
