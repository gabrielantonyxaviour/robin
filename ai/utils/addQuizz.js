require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
async function addQuizz(pollId, quizzes_url, tweet, topScoreTokenReward) {
  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.SUPABASE_PUBLIC_ANON_KEY
  );
  console.log({
    id: parseInt(pollId),
    hex_id: pollId,
    data: quizzes_url,
    tweet_url: tweet,
    top_score_token_reward: topScoreTokenReward,
    cast_url: null,
  });
  const { data: insertData, error } = await supabase
    .from("quiz")
    .insert({
      id: parseInt(pollId),
      hex_id: pollId,
      data: quizzes_url,
      tweet_url: tweet,
      top_score_token_reward: topScoreTokenReward,
      cast_url: null,
    })
    .select();

  console.log("ERROR");
  console.log(error);
}

module.exports = {
  addQuizz,
};
