import { useState } from 'react'
import { Check, ChevronsDown, XCircle, CircleDashed, FlagTriangleRight, StickyNote, Tags, MoveDown, Archive, Forward, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ToastStack, type ToastItem } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-border">
        <h2 className="font-poppins font-semibold text-xl text-foreground">{title}</h2>
        {description && <p className="font-sans text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-poppins text-xs text-muted-foreground">{children}</span>
}

function TokenLabel({ name, value }: { name: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-poppins font-medium text-xs text-foreground">{name}</span>
      {value && <span className="font-sans text-[10px] text-muted-foreground">{value}</span>}
    </div>
  )
}

// ─── Color swatch ───────────────────────────────────────────────────────────

function Swatch({ label, value, varName, className }: { label: string; value?: string; varName?: string; className?: string }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div
        className={cn('h-14 rounded-xl border border-black/5', className)}
        style={varName ? { background: `var(${varName})` } : undefined}
      />
      <TokenLabel name={label} value={value} />
    </div>
  )
}

// ─── Radius swatch ──────────────────────────────────────────────────────────

function RadiusSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('size-16 bg-brand/30 border-2 border-brand', className)} />
      <Label>{label}</Label>
    </div>
  )
}

// ─── Badge ──────────────────────────────────────────────────────────────────

const BADGE_MAP: Record<string, { label: string; wrapperClass: string }> = {
  flagged:   { label: 'Flagged',   wrapperClass: 'bg-gradient-to-r from-soft-red to-brighter text-soft-red-foreground' },
  notes:     { label: 'Notes',     wrapperClass: 'bg-gradient-to-r from-soft-indigo to-brighter text-soft-indigo-foreground' },
  'no-stock':  { label: 'No Stock',  wrapperClass: 'bg-card text-foreground border border-border' },
  'low-stock': { label: 'Low Stock', wrapperClass: 'bg-gradient-to-r from-soft-amber to-brighter text-soft-amber-foreground' },
  promotion: { label: 'Promotion', wrapperClass: 'bg-gradient-to-r from-soft-lime to-brighter text-soft-lime-foreground' },
}

function Badge({ variant }: { variant: keyof typeof BADGE_MAP }) {
  const { label, wrapperClass } = BADGE_MAP[variant]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-sans', wrapperClass)}>
      {label}
    </span>
  )
}

// ─── Status icon ─────────────────────────────────────────────────────────────

const STATUS_ICONS = [
  { icon: <Check className="size-4 text-green" />,        label: 'Good Stock',   color: 'text-green' },
  { icon: <ChevronsDown className="size-4 text-amber" />, label: 'Low Stock',    color: 'text-amber' },
  { icon: <XCircle className="size-4 text-red" />,        label: 'No Stock',     color: 'text-red' },
  { icon: <CircleDashed className="size-4 text-muted-foreground" />, label: 'Out of Stock', color: 'text-muted-foreground' },
]

// ─── Signal badges ───────────────────────────────────────────────────────────

const SIGNAL_ITEMS = [
  { Icon: FlagTriangleRight, label: 'Flagged',    cls: 'from-soft-red to-brighter text-soft-red-foreground',     variant: 'red' },
  { Icon: CircleDashed,      label: 'No Stock',   cls: 'bg-card text-foreground border border-border',           variant: 'default' },
  { Icon: MoveDown,          label: 'Low Stock',  cls: 'from-soft-amber to-brighter text-soft-amber-foreground', variant: 'default' },
  { Icon: Check,             label: 'Good Stock', cls: 'from-soft-lime to-brighter text-soft-lime-foreground',   variant: 'default' },
  { Icon: StickyNote,        label: 'Notes',      cls: 'from-soft-indigo to-brighter text-soft-indigo-foreground', variant: 'default' },
  { Icon: Tags,              label: 'Promotion',  cls: 'from-soft-green to-brighter text-soft-green-foreground', variant: 'default' },
]

// ─── Risk badges ─────────────────────────────────────────────────────────────

const RISK_ITEMS = [
  { label: 'High',   from: 'from-soft-red',   text: 'text-soft-red-foreground',   bar: 'var(--red)',   pct: 68 },
  { label: 'Medium', from: 'from-soft-amber', text: 'text-soft-amber-foreground', bar: 'var(--amber)', pct: 42 },
  { label: 'Low',    from: 'from-soft-lime',  text: 'text-soft-lime-foreground',  bar: 'var(--green)', pct: 18 },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export function DesignAssetsPage() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  function addToast(message: string, withUndo = false) {
    setToasts(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      ...(withUndo ? { onUndo: () => {} } : {}),
    }])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card px-10 py-8">
        <h1 className="font-poppins font-bold text-3xl text-foreground">Design Assets</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Tokens and components used across the Eileen template.</p>
      </div>

      <div className="px-10 py-10 flex flex-col gap-16 max-w-5xl">

        {/* ── Colors ── */}
        <Section title="Color Tokens" description="Semantic colors mapped from CSS custom properties.">

          <div className="flex flex-col gap-8">
            {/* Core */}
            <div className="flex flex-col gap-3">
              <Label>Core</Label>
              <div className="grid grid-cols-8 gap-4">
                <Swatch label="background"    varName="--background" />
                <Swatch label="foreground"    varName="--foreground" />
                <Swatch label="card"          varName="--card" />
                <Swatch label="muted"         varName="--muted" />
                <Swatch label="accent"        varName="--accent" />
                <Swatch label="border"        varName="--border" className="border-2 border-dashed border-border-alpha" />
                <Swatch label="primary"       varName="--primary" />
                <Swatch label="secondary"     varName="--secondary" />
              </div>
            </div>

            {/* Brand & semantic */}
            <div className="flex flex-col gap-3">
              <Label>Brand & Semantic</Label>
              <div className="grid grid-cols-8 gap-4">
                <Swatch label="brand"   value="#f9b9af" varName="--brand" />
                <Swatch label="green"   value="#519249" varName="--green" />
                <Swatch label="red"     value="#f91616" varName="--red" />
                <Swatch label="amber"   value="#ffb900" varName="--amber" />
                <Swatch label="darker"  varName="--darker" />
                <Swatch label="brighter" varName="--brighter" />
              </div>
            </div>

            {/* Soft palette */}
            <div className="flex flex-col gap-3">
              <Label>Soft Palette</Label>
              <div className="grid grid-cols-8 gap-4">
                <Swatch label="soft-red"     varName="--soft-red" />
                <Swatch label="soft-amber"   varName="--soft-amber" />
                <Swatch label="soft-lime"    varName="--soft-lime" />
                <Swatch label="soft-green"   varName="--soft-green" />
                <Swatch label="soft-indigo"  varName="--soft-indigo" />
                <Swatch label="soft-rose"    varName="--soft-rose" />
                <Swatch label="soft-fuchsia" varName="--soft-fuchsia" />
                <Swatch label="soft-salmon"  varName="--soft-salmon" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-3">
              <Label>Sidebar</Label>
              <div className="grid grid-cols-8 gap-4">
                <Swatch label="sidebar"           varName="--sidebar" />
                <Swatch label="sidebar-accent"    varName="--sidebar-accent" />
                <Swatch label="sidebar-border"    varName="--sidebar-border" />
                <Swatch label="sidebar-foreground" varName="--sidebar-foreground" />
                <Swatch label="sidebar-signal"    varName="--sidebar-signal" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography" description="Two typefaces: Geist Variable (sans) and Poppins.">
          <div className="flex flex-col gap-8">

            {/* Scale */}
            <div className="flex flex-col gap-3">
              <Label>Type Scale — Geist (font-sans)</Label>
              <div className="flex flex-col gap-4 bg-card border border-border rounded-2xl p-6">
                {[
                  { cls: 'text-xs',   label: 'xs / 12px',  sample: 'The quick brown fox' },
                  { cls: 'text-sm',   label: 'sm / 14px',  sample: 'The quick brown fox' },
                  { cls: 'text-base', label: 'base / 16px', sample: 'The quick brown fox' },
                  { cls: 'text-lg',   label: 'lg / 18px',  sample: 'The quick brown fox' },
                  { cls: 'text-xl',   label: 'xl / 20px',  sample: 'The quick brown fox' },
                  { cls: 'text-2xl',  label: '2xl / 24px', sample: 'The quick brown fox' },
                  { cls: 'text-3xl',  label: '3xl / 30px', sample: 'The quick brown fox' },
                ].map(({ cls, label, sample }) => (
                  <div key={cls} className="flex items-baseline gap-6">
                    <span className="w-28 font-sans text-xs text-muted-foreground shrink-0">{label}</span>
                    <span className={cn('font-sans text-foreground', cls)}>{sample}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Poppins */}
            <div className="flex flex-col gap-3">
              <Label>Poppins (font-poppins)</Label>
              <div className="flex flex-col gap-4 bg-card border border-border rounded-2xl p-6">
                {[
                  { weight: 'font-medium',   label: 'Medium 500',   sample: 'Store Insights — Navigation Label' },
                  { weight: 'font-semibold', label: 'Semibold 600', sample: 'Eileen — Brand Heading' },
                ].map(({ weight, label, sample }) => (
                  <div key={weight} className="flex items-baseline gap-6">
                    <span className="w-28 font-sans text-xs text-muted-foreground shrink-0">{label}</span>
                    <span className={cn('font-poppins text-lg text-foreground', weight)}>{sample}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Border Radius ── */}
        <Section title="Border Radius" description="Computed from --radius base (0.625rem).">
          <div className="flex items-end gap-8 flex-wrap bg-card border border-border rounded-2xl p-8">
            <RadiusSwatch label="sm"    className="rounded-sm" />
            <RadiusSwatch label="md"    className="rounded-md" />
            <RadiusSwatch label="lg"    className="rounded-lg" />
            <RadiusSwatch label="xl"    className="rounded-xl" />
            <RadiusSwatch label="2xl"   className="rounded-2xl" />
            <RadiusSwatch label="3xl"   className="rounded-3xl" />
            <RadiusSwatch label="full"  className="rounded-full" />
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Button" description="Variants and sizes from src/components/ui/button.tsx">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Variants</Label>
              <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-2xl p-6">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Sizes</Label>
              <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-2xl p-6">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Bell className="size-4" /></Button>
                <Button size="icon-sm"><Bell className="size-4" /></Button>
                <Button size="icon-lg"><Bell className="size-4" /></Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>States</Label>
              <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-2xl p-6">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Tooltip ── */}
        <Section title="Tooltip" description="Hover-triggered label. src/components/ui/Tooltip.tsx">
          <div className="flex flex-wrap gap-4 bg-card border border-border rounded-2xl p-8">
            <Tooltip label="Flag this submission">
              <button className="h-9 px-4 rounded-full border border-border bg-background hover:bg-accent text-sm text-foreground transition-colors">
                Hover me
              </button>
            </Tooltip>
            <Tooltip label="Archive">
              <button className="size-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors">
                <Archive className="size-4 text-foreground" />
              </button>
            </Tooltip>
            <Tooltip label="Send submission">
              <button className="size-9 flex items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors">
                <Forward className="size-4 text-foreground" />
              </button>
            </Tooltip>
          </div>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast" description="Stacked notifications with optional undo. src/components/ui/Toast.tsx">
          <div className="flex flex-wrap gap-3 bg-card border border-border rounded-2xl p-8">
            <button
              onClick={() => addToast('Exported to CSV successfully')}
              className="h-9 px-4 rounded-full border border-border bg-background hover:bg-accent text-sm text-foreground transition-colors"
            >
              Show toast
            </button>
            <button
              onClick={() => addToast('Cards flagged', true)}
              className="h-9 px-4 rounded-full border border-border bg-background hover:bg-accent text-sm text-foreground transition-colors"
            >
              Toast with Undo
            </button>
            <button
              onClick={() => {
                addToast('First notification')
                setTimeout(() => addToast('Second notification'), 200)
                setTimeout(() => addToast('Third notification'), 400)
              }}
              className="h-9 px-4 rounded-full border border-border bg-background hover:bg-accent text-sm text-foreground transition-colors"
            >
              Stack 3 toasts
            </button>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges" description="Submission card tags used across the Shelf page.">
          <div className="flex flex-wrap gap-3 bg-card border border-border rounded-2xl p-8">
            {(Object.keys(BADGE_MAP) as Array<keyof typeof BADGE_MAP>).map(v => (
              <Badge key={v} variant={v} />
            ))}
          </div>
        </Section>

        {/* ── Status Icons ── */}
        <Section title="Status Icons" description="Product table status indicators used inside the drawer.">
          <div className="flex flex-wrap gap-6 bg-card border border-border rounded-2xl p-8">
            {STATUS_ICONS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Tooltip label={label}>
                  <span className="inline-flex">{icon}</span>
                </Tooltip>
                <span className="font-sans text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Signal Badges ── */}
        <Section title="Signal Badges" description="Store and shelf signal indicators shown on cards and map popovers.">
          <div className="flex flex-wrap gap-2 bg-card border border-border rounded-2xl p-8">
            {SIGNAL_ITEMS.map(({ Icon, label, cls }) => (
              <div
                key={label}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md border border-black/5 text-xs font-semibold font-sans',
                  cls.startsWith('bg-card') ? cls : `bg-gradient-to-r ${cls}`,
                )}
              >
                <span>{label}</span>
                <Icon className="size-3.5 opacity-40" />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Risk Indicators ── */}
        <Section title="Risk Indicators" description="Risk badge + progress bar used on store map popovers.">
          <div className="flex gap-6 flex-wrap">
            {RISK_ITEMS.map(({ label, from, text, bar, pct }) => (
              <div key={label} className="flex-1 min-w-[200px] bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium text-sm text-foreground">Risk</span>
                  <div className={cn('flex items-center px-3 py-1 rounded-md border border-black/5 bg-gradient-to-r to-brighter', from)}>
                    <span className={cn('font-sans font-semibold text-xs whitespace-nowrap', text)}>{label}</span>
                  </div>
                </div>
                <div className="relative h-1.5 w-full rounded-full">
                  <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: bar }} />
                  <div className="absolute left-0 top-0 h-full rounded-full opacity-70" style={{ width: `${pct}%`, backgroundColor: bar }} />
                </div>
                <span className="font-sans text-xs text-muted-foreground">{pct}% risk score</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shadows ── */}
        <Section title="Shadows" description="Box shadow tokens used for cards and popovers.">
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Card shadow',    cls: 'shadow-[0px_2px_2px_0px_var(--shadow)]' },
              { label: 'Popover shadow', cls: 'shadow-[0px_4px_28px_0px_var(--shadow)]' },
              { label: 'Sidebar shadow', cls: 'shadow-[0px_16px_44px_0px_var(--shadow)]' },
            ].map(({ label, cls }) => (
              <div key={label} className={cn('flex-1 min-w-[160px] h-20 bg-card border border-border rounded-2xl flex items-center justify-center', cls)}>
                <span className="font-sans text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>

      <ToastStack toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}
