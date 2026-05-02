import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

/**
 * Returns the variant for a PostHog feature flag.
 *
 * Usage:
 *   const variant = useFeatureFlag('shelf-card-layout')
 *   if (variant === 'test') { ... } else { ... }
 *
 * Returns undefined while flags are loading, then 'control', 'test',
 * or a custom string variant once resolved.
 */
export function useFeatureFlag(flagKey: string): string | boolean | undefined {
  const [variant, setVariant] = useState<string | boolean | undefined>(
    () => posthog.getFeatureFlag(flagKey)
  )

  useEffect(() => {
    // Flags may not be loaded yet on first render — wait for them
    const unsubscribe = posthog.onFeatureFlags(() => {
      setVariant(posthog.getFeatureFlag(flagKey))
    })
    return unsubscribe
  }, [flagKey])

  return variant
}
