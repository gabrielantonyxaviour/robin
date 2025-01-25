import * as fs from "fs";
import * as path from "path";
export interface CryptoPanicNewsItem {
  sentiment: number;
  source: string; // Just the domain of the source
  title: string;
  published_at: string;
  currencies: string[]; // Just the currency code
  url: string;
  created_at: string;
}

export interface TwitterNewsItem {
  title: string;
  created_at: string;
  url: string;
}

export interface AggregatedNewsData {
  cryptoPanic: CryptoPanicNewsItem[];
  twitter: TwitterNewsItem[];
  lastUpdated: number;
}

// Raw API response interfaces
interface CryptoPanicRawResponse {
  results: {
    kind: string;
    domain: string;
    votes: {
      negative: number;
      positive: number;
      important: number;
      liked: number;
      disliked: number;
      lol: number;
      toxic: number;
      saved: number;
      comments: number;
    };
    source: {
      title: string;
      region: string;
      domain: string;
    };
    title: string;
    published_at: string;
    currencies: Array<{
      code: string;
      title: string;
      slug: string;
    }>;
    id: number;
    url: string;
    created_at: string;
  }[];
}
const secrets = JSON.parse(fs.readFileSync("./secrets.json", "utf8"));

class NewsProvider {
  private readonly API_CONFIG = {
    CRYPTO_PANIC_URL: "https://cryptopanic.com/api/v1/posts/",
    TWITTER_ACCOUNTS: ["cointelegraph", "coindesk", "TheBlock__"],
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    FILTERS: ["hot", "rising", "bullish"] as const,
  };

  private async fetchCryptoPanicNews(): Promise<CryptoPanicRawResponse> {
    const queryParams = new URLSearchParams({
      auth_token: secrets.CRYPTO_PANIC_API_KEY,
      public: "true",
      kind: "news",
      regions: "en",
    });

    const url = `${this.API_CONFIG.CRYPTO_PANIC_URL}?${queryParams}`;

    for (let i = 0; i < this.API_CONFIG.MAX_RETRIES; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);

        const data = await response.json();
        return data;
      } catch (error) {
        if (i === this.API_CONFIG.MAX_RETRIES - 1) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, this.API_CONFIG.RETRY_DELAY * Math.pow(2, i))
        );
      }
    }

    throw new Error("Failed to fetch CryptoPanic news");
  }

  private async fetchTwitterNews(
    bearerToken: string
  ): Promise<TwitterNewsItem[]> {
    try {
      const accounts = ["cointelegraph", "coindesk", "TheBlock__"];
      const query = `(from:${accounts.join(" OR from:")}) -is:retweet`;

      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
          query
        )}&max_results=10&tweet.fields=created_at`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data.data.map((tweet: any) => ({
        title: tweet.text,
        url: `https://twitter.com/i/web/status/${tweet.id}`,
        created_at: tweet.created_at,
      }));
    } catch (error) {
      console.error("Error fetching Twitter news:", error);
      return [];
    }
  }

  private calculateSentiment(
    votes: CryptoPanicRawResponse["results"][0]["votes"]
  ): number {
    return (
      votes.positive * 2 +
      votes.liked -
      votes.negative * 2 -
      votes.disliked -
      votes.toxic * 3
    );
  }

  private transformCryptoPanicNews(
    rawNews: CryptoPanicRawResponse
  ): CryptoPanicNewsItem[] {
    console.log("RAW NEWS");
    console.log(rawNews);
    return rawNews.results.map((item) => ({
      sentiment: this.calculateSentiment(item.votes),
      source: item.source.domain,
      title: item.title,
      published_at: item.published_at,
      currencies: item.currencies ? item.currencies.map((c) => c.code) : [],
      url: item.url,
      created_at: item.created_at,
    }));
  }

  async getAggregatedNewsData(
    bearerToken: string
  ): Promise<AggregatedNewsData> {
    try {
      // // Fetch news from all sources
      // const cryptoPanicNewsData = await this.fetchCryptoPanicNews();
      // // Transform CryptoPanic news
      // const cryptoPanicNews = this.transformCryptoPanicNews(cryptoPanicNewsData)
      //   // Remove duplicates based on URL
      //   .filter(
      //     (item, index, self) =>
      //       index === self.findIndex((t) => t.url === item.url)
      //   )
      //   // Sort by sentiment and date
      //   .sort((a, b) => {
      //     if (b.sentiment !== a.sentiment) {
      //       return b.sentiment - a.sentiment;
      //     }
      //     return (
      //       new Date(b.published_at).getTime() -
      //       new Date(a.published_at).getTime()
      //     );
      //   })
      //   .slice(0, 20); // Keep top 20 news items

      const twitterNews = await this.fetchTwitterNews(bearerToken);

      return {
        cryptoPanic: [],
        twitter: twitterNews,
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error("Error aggregating news:", error);
      throw error;
    }
  }

  formatNewsData(data: AggregatedNewsData): string {
    let output = "**Crypto Market News Update**\n\n";

    // Format CryptoPanic news
    output += "**Top Crypto News**\n";
    data.cryptoPanic.slice(0, 5).forEach((news, index) => {
      output += `${index + 1}. ${news.title}\n`;
      if (news.currencies.length > 0) {
        output += `   Related: ${news.currencies
          .map((code) => `$${code}`)
          .join(", ")}\n`;
      }
      output += `   Source: ${news.source}\n`;
      output += `   Sentiment: ${
        news.sentiment > 0 ? "📈 Bullish" : "📉 Bearish"
      }\n\n`;
    });

    // Format Twitter news if available
    if (data.twitter.length > 0) {
      output += "\n**Latest from Crypto Twitter**\n";
      data.twitter.slice(0, 3).forEach((tweet, index) => {
        output += `${index + 1}. ${tweet.title}\n`;
      });
    }

    output += `\nLast Updated: ${new Date(
      data.lastUpdated
    ).toLocaleString()}\n`;
    return output;
  }

  async getFormattedNews(bearerToken: string): Promise<string> {
    try {
      const newsData = await this.getAggregatedNewsData(bearerToken);
      return this.formatNewsData(newsData);
    } catch (error) {
      console.error("Error formatting news:", error);
      return "Unable to fetch news at this time. Please try again later.";
    }
  }
}

(async function () {
  try {
    const provider = new NewsProvider();
    console.log(await provider.getFormattedNews(secrets.TWITTER_BEARER_TOKEN));
  } catch (error) {
    console.error("Error fetching news:", error);
    return "Unable to fetch news at this time. Please try again later.";
  }
})();
