declare global {
  interface Window {
    clarity?: (method: string, key: string, value: unknown) => void
  }
}

export function trackEvent(key: string, value: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('set', key, value)
  }
}
