require("dotenv").config();
const {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  decodeEventLog,
  parseAbi,
  parseEther,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

const educhainTestnet = defineChain({
  id: 656476,
  name: "Educhain Testnet",
  network: "Educhain Testnet",
  nativeCurrency: { name: "Test EDU", symbol: "tEDU", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
  },
  blockExplorers: {
    default: {
      name: "Educain Testnet Explorer",
      url: "https://opencampus-codex.blockscout.com/",
    },
  },
  testnet: true,
});

const ROBINX_CORE = "0x868d93b0Da22444100ADF128424bafF8B26500ff";
const ROBINX_CORE_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "tokenRewardAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "validity",
        type: "uint256",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "score",
        type: "uint8",
      },
    ],
    name: "mintRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function createPollTx(metadata_url) {
  const AI_AGENT_PRIVATE_KEY = process.env.AI_AGENT_PRIVATE_KEY;

  const account = privateKeyToAccount("0x" + AI_AGENT_PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: educhainTestnet,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: educhainTestnet,
    transport: http(),
  });
  const reward = parseEther(
    (Math.random() * (3 - 1) + 1).toFixed(2).toString()
  );
  const { request } = await publicClient.simulateContract({
    account,
    address: ROBINX_CORE,
    abi: ROBINX_CORE_ABI,
    functionName: "createPoll",
    args: [metadata_url, reward, (24 * 60 * 60).toString()],
  });
  const tx = await walletClient.writeContract(request);

  const transaction = await publicClient.getTransactionReceipt({
    hash: tx,
  });

  console.log(transaction);

  const eventLog = decodeEventLog({
    abi: parseAbi([
      "event QuizCreated(uint256 pollId, uint256 validity, uint256 tokenRewardAmount, string metadata)",
    ]),
    data: transaction.logs[0].data,
    topics: transaction.logs[0].topics,
  });
  console.log(eventLog);

  return {
    txHash: tx,
    pollId: "0x" + eventLog.args.pollId.toString(16),
    reward,
  };
}

module.exports = {
  createPollTx,
};
