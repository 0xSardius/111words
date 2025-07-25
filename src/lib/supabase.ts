import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface User {
  id: string
  fid: number
  username: string | null
  display_name: string | null
  pfp_url: string | null
  wallet_address: string | null
  current_streak: number
  longest_streak: number
  total_coins: number
  total_words: number
  last_write_date: string | null
  created_at: string
  updated_at: string
}

export interface Writing {
  id: string
  user_id: string
  fid: number
  content: string
  word_count: number
  streak_day: number
  is_111_legend: boolean
  coin_address: string | null
  tx_hash: string | null
  coin_symbol: string | null
  created_at: string
  write_date: string
}

export interface DailyPrompt {
  id: number
  prompt: string
  day_date: string
  created_at: string
}

// Database functions
export async function getUserByFid(fid: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('fid', fid)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

export async function createUser(userData: {
  fid: number
  username?: string
  display_name?: string
  pfp_url?: string
  wallet_address?: string
}): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}

export async function createWritingAndUpdateUser(params: {
  fid: number
  content: string
  word_count: number
  streak_day: number
  is_111_legend: boolean
  coin_address?: string
  tx_hash?: string
  coin_symbol?: string
  write_date?: string
}): Promise<{ writing: Writing; user: User } | null> {
  // Use our custom function from the schema
  const { data, error } = await supabase
    .rpc('create_writing_and_update_user', {
      p_fid: params.fid,
      p_content: params.content,
      p_word_count: params.word_count,
      p_streak_day: params.streak_day,
      p_is_111_legend: params.is_111_legend,
      p_coin_address: params.coin_address,
      p_tx_hash: params.tx_hash,
      p_coin_symbol: params.coin_symbol,
      p_write_date: params.write_date
    })

  if (error) {
    console.error('Error creating writing and updating user:', error)
    return null
  }

  return data
}

export async function getDailyStats(): Promise<{
  daily_writers: number
  daily_writings: number
  daily_words: number
  avg_word_count: number
  legend_writings: number
} | null> {
  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching daily stats:', error)
    return null
  }

  return data
}

export async function getUserWritings(fid: number, limit = 10): Promise<Writing[]> {
  const { data, error } = await supabase
    .from('writings')
    .select('*')
    .eq('fid', fid)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching user writings:', error)
    return []
  }

  return data || []
}

export async function getAllUserWritings(fid: number, offset = 0, limit = 20): Promise<{
  writings: Writing[]
  hasMore: boolean
  total: number
}> {
  // Get total count
  const { count, error: countError } = await supabase
    .from('writings')
    .select('*', { count: 'exact', head: true })
    .eq('fid', fid)

  if (countError) {
    console.error('Error counting user writings:', countError)
    return { writings: [], hasMore: false, total: 0 }
  }

  // Get paginated writings
  const { data, error } = await supabase
    .from('writings')
    .select('*')
    .eq('fid', fid)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching all user writings:', error)
    return { writings: [], hasMore: false, total: count || 0 }
  }

  return {
    writings: data || [],
    hasMore: (offset + limit) < (count || 0),
    total: count || 0
  }
}

export async function checkUserWroteToday(fid: number): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('writings')
    .select('id')
    .eq('fid', fid)
    .eq('write_date', today)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking if user wrote today:', error)
    return false
  }

  return !!data
}

export async function getCurrentStreak(fid: number): Promise<number> {
  const user = await getUserByFid(fid)
  return user?.current_streak || 0
}

// Get writing by coin address
export async function getWritingByCoinAddress(coinAddress: string): Promise<{
  content: string
  word_count: number
  created_at: string
  user: {
    username: string
    display_name: string
  }
} | null> {
  console.log('🔍 getWritingByCoinAddress called with:', coinAddress)
  
  const { data, error } = await supabase
    .from('writings')
    .select(`
      content,
      word_count,
      created_at,
      fid,
      users (
        username,
        display_name
      )
    `)
    .eq('coin_address', coinAddress)
    .single()

  if (error) {
    console.error('Error fetching writing by coin address:', error)
    return null
  }

  if (!data) {
    console.log('No writing found for coin address:', coinAddress)
    return null
  }

  console.log('✅ Found writing for coin address:', {
    hasContent: !!data.content,
    wordCount: data.word_count,
    userInfo: data.users
  })

  return {
    content: data.content,
    word_count: data.word_count,
    created_at: data.created_at,
    user: {
      username: data.users?.[0]?.username || 'anonymous',
      display_name: data.users?.[0]?.display_name || 'Anonymous Writer'
    }
  }
} 