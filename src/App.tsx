import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { AiLeanPage } from '@/pages/AiLean'
import { SubmissionsPage } from '@/pages/Submissions'

type Theme = 'theme-4' | 'dark'
type Page = 'ai-lean' | 'submissions'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>('theme-4')
  const [page, setPage] = useState<Page>('submissions')

  const isDark = theme === 'dark'
  const isSubmissions = page === 'submissions'

  return (
    <div className={`${theme} h-screen bg-background flex overflow-hidden`}>
      <div className="shrink-0 p-4 h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
      </div>

      <main className={`relative flex-1 overflow-y-auto ${isSubmissions ? '' : 'flex items-center justify-center'}`}>
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? 'theme-4' : 'dark')}
          className="absolute top-4 right-4 size-9 flex items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-accent z-10"
          aria-label="Toggle theme"
        >
          {isDark
            ? <Sun className="size-4 text-foreground" />
            : <Moon className="size-4 text-foreground" />
          }
        </button>

        {/* Page toggle (dev helper) */}
        <button
          onClick={() => setPage(p => p === 'ai-lean' ? 'submissions' : 'ai-lean')}
          className="absolute top-4 right-16 h-9 px-3 flex items-center rounded-full border border-border bg-background shadow-sm transition hover:bg-accent text-xs text-muted-foreground z-10"
        >
          {isSubmissions ? 'Ai.Lean' : 'The Shelf'}
        </button>

        {isSubmissions ? <SubmissionsPage /> : <AiLeanPage />}
      </main>
    </div>
  )
}
