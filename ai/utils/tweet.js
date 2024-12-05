require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
export async function tweet(text) {
  try {
    const tweet = await client.v2.tweet(text);
    console.log("Tweet posted successfully:", tweet.data.id);
    return tweet;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error;
  }
}
