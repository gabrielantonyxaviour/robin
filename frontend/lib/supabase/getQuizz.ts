const { createClient } = require("@supabase/supabase-js");

export async function getQuizz(pollId: string) {
  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY
  );
  const { data: fetchedData, error } = await supabase
    .from("quizz")
    .select("*")
    .eq("id", pollId);

  console.log(fetchedData);
  return fetchedData;
}
