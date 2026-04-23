import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import logoGAcme from '@/assets/logos/logo-g-acme.svg'
import logoRAcme from '@/assets/logos/logo-r-acme.svg'
import logoAAcme from '@/assets/logos/logo-a-acme.svg'

interface Workspace {
  id: string
  name: string
  logo: string
}

const WORKSPACES: Workspace[] = [
  { id: '1', name: 'G Acme',         logo: logoGAcme },
  { id: '2', name: 'R Acme USA',     logo: logoRAcme },
  { id: '3', name: 'A Acme Belgium', logo: logoAAcme },
]

interface DropdownProps {
  rect: DOMRect
  triggerEl: HTMLButtonElement
  workspaces: Workspace[]
  selected: Workspace
  collapsed: boolean
  onSelect: (w: Workspace) => void
  onClose: () => void
}

function WorkspaceDropdown({ rect, triggerEl, workspaces, selected, collapsed, onSelect, onClose }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        ref.current && !ref.current.contains(target) &&
        !triggerEl.contains(target)
      ) {
        onClose()
      }
    }
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose, triggerEl])

  const style = collapsed
    ? { top: rect.top, left: rect.right + 4, width: 232 }
    : { top: rect.bottom, left: rect.left, width: rect.width }

  const containerClass = collapsed
    ? 'fixed z-50 bg-sidebar dark:bg-muted border border-sidebar-border rounded-[24px] shadow-[0px_4px_4px_0px_var(--shadow)] p-[2px]'
    : 'fixed z-50 bg-sidebar dark:bg-muted border-l border-r border-b border-sidebar-border rounded-bl-2xl rounded-br-2xl shadow-[0px_4px_4px_0px_var(--shadow)] overflow-hidden p-[2px] pt-0'

  return (
    <div ref={ref} className={containerClass} style={style}>
      {workspaces.map(w => (
        <button
          key={w.id}
          onClick={() => onSelect(w)}
          className={cn(
            'group w-full flex items-center gap-3 h-11 min-h-[44px] shrink-0 px-4 rounded-full transition text-left',
            w.id === selected.id
              ? 'bg-gradient-to-r from-sidebar-accent to-brighter shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:bg-sidebar-accent dark:bg-none dark:shadow-none'
              : 'hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-brighter hover:shadow-[0px_0px_14px_0px_var(--sidebar-accent)] dark:hover:shadow-none dark:hover:from-white/8 dark:hover:to-transparent'
          )}
        >
          <img
            src={w.logo}
            alt={w.name}
            className="shrink-0 w-5 h-5 object-contain"
          />
          <span className={cn(
            'flex-1 font-poppins font-medium text-sm leading-5 truncate',
            w.id === selected.id
              ? 'text-sidebar-accent-foreground'
              : 'text-muted-foreground group-hover:text-sidebar-accent-foreground'
          )}>
            {w.name}
          </span>
          {w.id === selected.id
            ? <Check className="size-5 shrink-0 text-sidebar-accent-foreground" />
            : <span className="size-5 shrink-0" />
          }
        </button>
      ))}
    </div>
  )
}

interface WorkspaceSwitcherProps {
  collapsed: boolean
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(WORKSPACES[0])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect())
    }
    setOpen(o => !o)
  }

  const handleSelect = (w: Workspace) => {
    setSelected(w)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center h-11 border border-sidebar-border bg-sidebar transition-[border-radius] duration-150',
          'shadow-[0px_0px_13.8px_0px_rgba(0,0,0,0.10)]',
          collapsed ? 'justify-center px-3' : 'gap-3 px-4',
          !collapsed && open
            ? 'rounded-tl-[20px] rounded-tr-[20px] rounded-bl-none rounded-br-none border-b-transparent'
            : 'rounded-full'
        )}
      >
        <img
          src={selected.logo}
          alt={selected.name}
          className="shrink-0 w-4 h-4 object-contain"
        />
        {!collapsed && (
          <>
            <span className="flex-1 font-poppins font-medium text-sm leading-5 text-sidebar-foreground text-left truncate">
              {selected.name}
            </span>
            <ChevronsUpDown className="size-4 opacity-50 text-sidebar-foreground shrink-0" />
          </>
        )}
      </button>

      {open && rect && triggerRef.current &&
        createPortal(
          <WorkspaceDropdown
            rect={rect}
            triggerEl={triggerRef.current}
            workspaces={WORKSPACES}
            selected={selected}
            collapsed={collapsed}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />,
          triggerRef.current.closest<HTMLElement>('[class*="theme-"], .dark') ?? document.body
        )}
    </>
  )
}
