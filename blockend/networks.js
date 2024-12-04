require("@chainlink/env-enc").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 3;

const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
const accounts = [];
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY);
}

const robinXAiAgentAddress = "0x0429A2Da7884CA14E53142988D5845952fE4DF6a";

const networks = {
  educhainTestnet: {
    url: "https://rpc.open-campus-codex.gelato.digital",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "sdklnjvndslknv",
    chainId: 656476,
    confirmations: 4,
    nativeCurrencySymbol: "ETH",
    blockExplorer: "https://edu-chain-testnet.blockscout.com/",
    verifyApiUrl: "https://edu-chain-testnet.blockscout.com/api",
    mailbox: "0xCfA62ac3Cc7E9eBA17Fab9Bc92df6AC648A18338",
    robinXCore: "0x98f862014f5D58bfBcf972695c1b12e9e8821E7A",
  },
  sepolia: {
    url: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: "sdklnjvndslknv",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    blockExplorer: "https://eth-sepolia.blockscout.com/",
    verifyApiUrl: "https://eth-sepolia.blockscout.com/api",
    mailbox: "0xb2B892c9E8A1137Ae66f508c557a87Fda937FB81",
    worldIdRouter: "0x469449f251692e0779667583026b5a1e99512157",
    appId: "app_staging_377789e106476d4596e59f1ff516d4f0",
    actionId: "verify-humanness",
    robinXWorldIdVerifier: "0x95C82Bb347A6ADf97F3B3Bd2B1c57b38E4C5E863",
  },
};

module.exports = {
  networks,
  robinXAiAgentAddress,
};
