import posthog from 'posthog-js'

declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void
  }
}

type Properties = Record<string, string | number | boolean | null | undefined>

const DEV = import.meta.env.DEV

function clarityEvent(name: string, props?: Properties) {
  if (typeof window?.clarity !== 'function') {
    if (DEV) console.warn('[Clarity ✗] not available —', name, props)
    return
  }
  window.clarity('event', name)
  if (props) {
    for (const [key, val] of Object.entries(props)) {
      if (val !== null && val !== undefined) {
        window.clarity('set', key, String(val))
      }
    }
  }
  if (DEV) console.log('[Clarity ✓]', name, props)
}

/**
 * Fire an event to both Clarity and PostHog simultaneously.
 * Use this everywhere instead of calling each SDK directly.
 */
export function track(name: string, props?: Properties) {
  clarityEvent(name, props)
  posthog.capture(name, props)
}

/** Identify the current user in both Clarity and PostHog. */
export function identify(userId: string, props?: Properties) {
  if (typeof window?.clarity === 'function') {
    window.clarity('identify', userId)
  }
  posthog.identify(userId, props)
  if (DEV) console.log('[Analytics] identify', userId, props)
}
