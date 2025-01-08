require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
async function addQuizz(pollId, quizzes_url, tweet, topScoreTokenReward) {
  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.SUPABASE_PUBLIC_ANON_KEY
  );
  console.log({
    hexId: pollId,
    data: quizzes_url,
    tweet_url: tweet,
    top_score_token_reward: topScoreTokenReward,
  });
  const { data: insertData, error } = await supabase
    .from("quiz")
    .insert({
      hexId: pollId,
      data: quizzes_url,
      tweet_url: tweet,
      top_score_token_reward: topScoreTokenReward,
    })
    .select();

  console.log(insertData);
}

module.exports = {
  addQuizz,
};
