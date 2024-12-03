require("@nomicfoundation/hardhat-toolbox");
require("hardhat-dependency-compiler");
require("hardhat-contract-sizer");
require("./tasks");
const { networks } = require("./networks");

const REPORT_GAS =
  process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 200,
  },
  viaIR: true,
};
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.7",
        settings: SOLC_SETTINGS,
      },
    ],
  },

  networks: {
    ...networks,
  },
  etherscan: {
    apiKey: {
      sepolia: networks.sepolia.verifyApiKey,
      educhainTestnet: networks.educhainTestnet.verifyApiKey,
    },
    customChains: [
      {
        network: "educhainTestnet",
        chainId: networks.educhainTestnet.chainId,
        urls: {
          apiURL: networks.educhainTestnet.verifyApiUrl,
          browserURL: networks.educhainTestnet.blockExplorer,
        },
      },
      {
        network: "sepolia",
        chainId: networks.sepolia.chainId,
        urls: {
          apiURL: networks.sepolia.verifyApiUrl,
          browserURL: networks.sepolia.blockExplorer,
        },
      },
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000,
  },
};
