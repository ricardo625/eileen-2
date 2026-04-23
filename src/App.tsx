import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { AiLeanPage } from '@/pages/AiLean'

type Theme = 'theme-4' | 'dark'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>('theme-4')

  const isDark = theme === 'dark'

  return (
    <div className={`${theme} h-screen bg-background flex overflow-hidden`}>
      <div className="shrink-0 p-4 h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
      </div>

      <main className="relative flex-1 flex items-center justify-center overflow-y-auto">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? 'theme-4' : 'dark')}
          className="absolute top-4 right-4 size-9 flex items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-accent"
          aria-label="Toggle theme"
        >
          {isDark
            ? <Sun className="size-4 text-foreground" />
            : <Moon className="size-4 text-foreground" />
          }
        </button>

        <AiLeanPage />
      </main>
    </div>
  )
}
