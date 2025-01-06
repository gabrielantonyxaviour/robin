import { createClient } from "@supabase/supabase-js";

export async function getQuizz(pollId: string) {
  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.SUPABASE_PUBLIC_ANON_KEY!
  );
  const { data: fetchedData, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", pollId);

  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: fetchedData![0].data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data[Math.floor(Math.random() * data.length)];
}
