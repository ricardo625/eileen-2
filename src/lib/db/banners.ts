import { supabase } from '@/lib/supabase'

export type BannerRow = {
  id: number
  banner: string
  checked: number
  past30: number
  sku_oos_rate: string
  sku_low_stock_rate: string
  brand_not_found: number
  sku_not_carried: number
  on_sale_rate: string
  unique_skus: number
  risk_label: string
  risk_percent: number
  linked_fields: string[]
  signal: string
  ai_suggestions: string[]
}

export async function fetchBanners(): Promise<BannerRow[]> {
  const { data, error } = await supabase.from('banners').select('*').order('banner')
  if (error) throw error
  return data ?? []
}

export async function updateBanner(id: number, updates: Partial<Omit<BannerRow, 'id'>>): Promise<void> {
  const { error } = await supabase.from('banners').update(updates).eq('id', id)
  if (error) throw error
}
