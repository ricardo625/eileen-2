import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import posthog from 'posthog-js'
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  debug: true,
  loaded: (ph) => {
    console.log('[PostHog] loaded successfully')
    ph.capture('app_loaded')
  },
})

// Expose for browser console debugging
;(window as unknown as Record<string, unknown>).posthog = posthog

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', color: '#f91616' }}>
          <strong>Runtime error — please open the browser console (F12) and report this:</strong>
          <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {(this.state.error as Error).message}
            {'\n\n'}
            {(this.state.error as Error).stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
)
