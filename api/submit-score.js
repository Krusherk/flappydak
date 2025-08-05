import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ffhgkerkuqtkysyfzubp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, score } = req.body;

  if (!address || typeof score !== "number") {
    return res.status(400).json({ error: "Address and score required" });
  }

  // Update score only if it's higher than previous
  const { data: existing, error } = await supabase
    .from("wallets")
    .select("score")
    .eq("address", address)
    .single();

  if (error || !existing) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  if (score > existing.score) {
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ score })
      .eq("address", address);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update score" });
    }
  }

  return res.status(200).json({ success: true });
}
