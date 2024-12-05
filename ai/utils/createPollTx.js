require("dotenv").config();
const {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  decodeEventLog,
  parseAbi,
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

const ROBINX_CORE = "0x1f8d9883C91a8210F43aA13BE5C9f576986EA027";
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
        internalType: "uint256",
        name: "receiverNullifierHash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export async function createPollTx(metadata_url) {
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

  const { request } = await publicClient.simulateContract({
    account,
    address: ROBINX_CORE,
    abi: ROBINX_CORE_ABI,
    functionName: "createPoll",
    args: [metadata_url, (24 * 60 * 60).toString()],
  });
  const tx = await walletClient.writeContract(request);

  const transaction = await publicClient.getTransactionReceipt({
    hash: tx,
  });

  console.log(transaction);

  const eventLog = decodeEventLog({
    abi: parseAbi([
      "event QuizCreated(uint256 pollId, uint256 validity, string metadata)",
    ]),
    data: transaction.logs[0].data,
    topics: transaction.logs[0].topics,
  });
  console.log(eventLog);

  return {
    txHash: tx,
    pollId: eventLog.args.pollId.toString(),
  };
}
