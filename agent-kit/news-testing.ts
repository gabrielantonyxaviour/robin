// import { CryptoNewsFetcher } from "./news-aggregation";
// import * as fs from "fs";

// const secrets = JSON.parse(fs.readFileSync("./secrets.json", "utf8"));
// // Initialize the news fetcher
// const config = {
//   cryptoPanicApiKey: secrets.CRYPTO_PANIC_API_KEY,
//   twitterBearerToken: secrets.TWITTER_BEARER_TOKEN,
// };

// const newsFetcher = new CryptoNewsFetcher(config);

// // Get news from all sources
// async function fetchAllNews() {
//   const allNews = await newsFetcher.getAllNews();
//   console.log("Combined news:", allNews);
// }

// // Or get news from a specific source
// async function fetchSpecificNews() {
//   const cryptoPanicNews = await newsFetcher.getCryptoPanicNews();
//   console.log("CryptoPanic news:", cryptoPanicNews);
// }

// fetchAllNews();

console.log(Date.now());
