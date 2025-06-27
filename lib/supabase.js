import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get user entries
export async function getUserEntries(userId) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching entries:', error)
    return {}
  }

  // Convert to the format expected by the frontend
  const entriesMap = {}
  data.forEach(entry => {
    entriesMap[entry.date] = {
      success: entry.success,
      happy: entry.happy,
      notes: entry.notes,
    }
  })

  return entriesMap
}

// Helper function to save/update entry
export async function saveEntry(userId, date, entry) {
  const { data, error } = await supabase
    .from('entries')
    .upsert({
      user_id: userId,
      date: date,
      success: entry.success,
      happy: entry.happy,
      notes: entry.notes,
    }, {
      onConflict: 'user_id,date'
    })

  if (error) {
    console.error('Error saving entry:', error)
    throw error
  }

  return data
} 