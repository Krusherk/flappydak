export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  console.log('✅ New wallet connected:', address);

  // 🔴 TODO: Save to database or file

  return res.status(200).json({ success: true });
}
