require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
export async function addQuizz(pollId, quizzes_url) {
  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.SUPABASE_PUBLIC_ANON_KEY
  );
  const { data: insertData, error } = await supabase
    .from("quizz")
    .insert({ id: pollId, data: quizzes_url })
    .select();

  console.log(insertData);
}
