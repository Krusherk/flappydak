import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ffhgkerkuqtkysyfzubp.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { address, score } = req.body

  if (!address || typeof score !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid data' })
  }

  // Insert into leaderboard
  const { error } = await supabase
    .from('leaderboard')
    .insert({ address, score })

  if (error) {
    console.error('Insert failed:', error)
    return res.status(500).json({ error: 'Failed to submit score' })
  }

  return res.status(200).json({ success: true })
}
