import { supabase } from '@/lib/supabase'

export type SubmissionRow = {
  id: string
  store_name: string
  address: string
  image: string
  badges: string[]
  badge_counts: Record<string, number>
  archived: boolean
  image_count: number
  completed_at: string | null
  completed_by: string | null
  completed_avatar: string | null
  note_count: number
}

export async function fetchSubmissions(): Promise<SubmissionRow[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('id')
  if (error) throw error
  return data ?? []
}

export async function updateSubmission(
  id: string,
  updates: Partial<Omit<SubmissionRow, 'id'>>,
): Promise<void> {
  const { error } = await supabase.from('submissions').update(updates).eq('id', id)
  if (error) throw error
}

export async function insertSubmission(
  row: Omit<SubmissionRow, 'id'>,
): Promise<SubmissionRow> {
  const { data, error } = await supabase.from('submissions').insert(row).select().single()
  if (error) throw error
  return data
}
