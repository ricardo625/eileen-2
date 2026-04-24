import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Tooltip } from '@/components/ui/Tooltip'
import { AiLeanPage } from '@/pages/AiLean'
import { SubmissionsPage } from '@/pages/Submissions'
import { StoresPage } from '@/pages/Stores'

type Theme = 'theme-4' | 'dark'
type Page = 'ai-lean' | 'submissions' | 'stores'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>('theme-4')
  const [page, setPage] = useState<Page>('submissions')
  const [submissionsDrawerOpen, setSubmissionsDrawerOpen] = useState(false)

  function handleLearnMore() {
    setPage('submissions')
    setSubmissionsDrawerOpen(true)
  }

  const isDark = theme === 'dark'
  const isFullPage = page === 'submissions' || page === 'stores'

  return (
    <div className={`${theme} h-screen bg-background flex overflow-hidden`}>
      <div className="shrink-0 p-4 h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          activePage={page}
          onNavigate={p => setPage(p as Page)}
        />
      </div>

      <main className={`relative flex-1 overflow-y-auto overflow-x-hidden ${isFullPage ? '' : 'flex items-center justify-center'}`}>
        {/* Theme toggle */}
        <Tooltip label={isDark ? 'Light mode' : 'Dark mode'} className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setTheme(isDark ? 'theme-4' : 'dark')}
            className="size-9 flex items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-accent"
          >
            {isDark
              ? <Sun className="size-4 text-foreground" />
              : <Moon className="size-4 text-foreground" />
            }
          </button>
        </Tooltip>

        {page === 'submissions' && <SubmissionsPage openDrawer={submissionsDrawerOpen} onDrawerClose={() => setSubmissionsDrawerOpen(false)} />}
        {page === 'stores'      && <StoresPage onLearnMore={handleLearnMore} onNavigateToShelf={() => { setPage('submissions'); setSubmissionsDrawerOpen(false) }} />}
        {page === 'ai-lean'     && <AiLeanPage />}
      </main>
    </div>
  )
}
