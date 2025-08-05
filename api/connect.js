import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffhgkerkuqtkysyfzubp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaGdrZXJrdXF0a3lzeWZ6dWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjM4MjYsImV4cCI6MjA2OTk5OTgyNn0.vF--zzzZdoD0Bx69zVE4yZbvCkk3ixigR6SbDVctvZY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  // Check if wallet already exists
  const { data: existing, error: fetchError } = await supabase
    .from("wallets")
    .select("id")
    .eq("address", address)
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ message: "Wallet already exists" });
  }

  // Insert new wallet
  const { error: insertError } = await supabase
    .from("wallets")
    .insert([{ address }]);

  if (insertError) {
    console.error("Insert error:", insertError);
    return res.status(500).json({ error: "Failed to save wallet address" });
  }

  return res.status(200).json({ success: true });
}
