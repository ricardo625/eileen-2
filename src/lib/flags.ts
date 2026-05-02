/**
 * All feature flag keys used in the app.
 * Add new flags here before using them in components.
 */
export const FLAGS = {
  STORES_INSIGHTS_ABOVE_TABLE: 'stores-insights-above-table-',
} as const

export type FlagKey = typeof FLAGS[keyof typeof FLAGS]
