import * as fs from "fs";

const secrets = JSON.parse(fs.readFileSync("./secrets.json", "utf8"));

const config = {
  birdEyeApiKey: secrets.BIRDEYE_API_KEY,
};

(async function main() {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/v3/search?chain=all&target=all&sort_by=volume_24h_usd&sort_type=desc&offset=0&limit=20`,
    {
      headers: {
        "X-API-KEY": config.birdEyeApiKey,
      },
    }
  );
  console.log(await response.json());
})();
