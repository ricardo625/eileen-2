import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Tooltip } from '@/components/ui/Tooltip'
import { AiLeanPage } from '@/pages/AiLean'
import { SubmissionsPage } from '@/pages/Submissions'
import { StoresPage, SHELF_SIGNAL_TOTAL } from '@/pages/Stores'

type Theme = 'theme-4' | 'dark'

const PATH_TO_PAGE: Record<string, string> = {
  '/shelf':   'submissions',
  '/stores':  'stores',
  '/ai-lean': 'ai-lean',
}

function getActivePage(pathname: string) {
  if (pathname.startsWith('/shelf')) return 'submissions'
  return PATH_TO_PAGE[pathname] ?? 'submissions'
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<Theme>('theme-4')

  const navigate = useNavigate()
  const location = useLocation()

  const activePage = getActivePage(location.pathname)

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const isDark = theme === 'dark'
  const isFullPage = activePage === 'submissions' || activePage === 'stores'

  function handleLearnMore(submissionId: string) {
    navigate(`/shelf/detail/${submissionId}`)
  }

  return (
    <div className={`${theme} h-screen bg-background flex overflow-hidden`}>
      <div className="shrink-0 p-4 h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          activePage={activePage}
          shelfBadge={SHELF_SIGNAL_TOTAL}
          onNavigate={page => {
            const path = Object.entries(PATH_TO_PAGE).find(([, p]) => p === page)?.[0] ?? '/shelf'
            navigate(path)
          }}
        />
      </div>

      <main className={`relative flex-1 overflow-y-auto overflow-x-hidden always-scroll ${isFullPage ? '' : 'flex items-center justify-center'}`}>
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

        <Routes>
          <Route path="/shelf"                    element={<SubmissionsPage />} />
          <Route path="/shelf/detail/:submissionId" element={<SubmissionsPage />} />
          <Route path="/stores"  element={<StoresPage onLearnMore={handleLearnMore} onNavigateToShelf={() => navigate('/shelf')} />} />
          <Route path="/ai-lean" element={<AiLeanPage />} />
          <Route path="*"        element={<Navigate to="/shelf" replace />} />
        </Routes>
      </main>
    </div>
  )
}
