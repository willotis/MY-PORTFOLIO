import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

/**
 * Fetches the most recently updated profile row without failing when
 * zero or multiple rows exist in the `profiles` table.
 */
export async function fetchLatestProfile(
  supabase: SupabaseClient
): Promise<{ data: Profile | null; error: unknown }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle<Profile>()

  return { data: data ?? null, error }
}

