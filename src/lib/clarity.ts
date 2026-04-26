declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void
  }
}

function clarityCall(method: string, ...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity(method, ...args)
    console.log('[Clarity ✓]', method, ...args)
  } else {
    console.warn('[Clarity ✗] window.clarity not available —', method, ...args)
  }
}

/**
 * Track a user interaction with Clarity.
 * - Fires clarity("event", name) for the action itself.
 * - Fires clarity("set", key, String(value)) for each metadata tag.
 *   Values must be primitives; null/undefined entries are skipped.
 */
export function trackEvent(
  name: string,
  tags?: Record<string, string | number | boolean | null | undefined>,
): void {
  clarityCall('event', name)
  if (tags) {
    for (const [key, val] of Object.entries(tags)) {
      if (val !== null && val !== undefined) {
        clarityCall('set', key, String(val))
      }
    }
  }
}
