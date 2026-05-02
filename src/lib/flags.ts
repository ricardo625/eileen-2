/**
 * All feature flag keys used in the app.
 * Add new flags here before using them in components.
 */
export const FLAGS = {
  // Example: 'shelf-card-layout' | 'stores-table-columns' | 'drawer-cta'
} as const

export type FlagKey = typeof FLAGS[keyof typeof FLAGS]
