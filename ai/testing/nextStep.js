require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  decodeEventLog,
  parseAbi,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");

const response = {
  quizzes_url:
    "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/files/bafkreicqzcqg5xhipygwe4slyown3xk5mme6fssecsk2w45qpwfiryw5tq?X-Algorithm=PINATA1&X-Date=1733340559&X-Expires=99999999999&X-Method=GET&X-Signature=06f4b82f3496a3ac5601c0432902a5b398d189dd3440029f7a257cb49a0ec00b",
  metadata_url:
    "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/files/bafkreihzzuqwcz62rasrsl5hvemhpuxbfds56hjcpbxxinau6zlxwsendy?X-Algorithm=PINATA1&X-Date=1733340564&X-Expires=99999999999&X-Method=GET&X-Signature=ac35afccf62c153ff61b6e568202cd7c7ba6bcd9381cf6dc8929c1f4ba4218f0",
};

// Send a transaction to the blockchain for metadata
// Send quizzes to supabase.
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

const ROBINX_CORE = "0xDc59057716677afE37755e8aA256c8d852D62f64";
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
async function main() {
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
    args: [response.metadata_url, (24 * 60 * 60).toString()],
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

  const supabase = createClient(
    "https://zrphknbmflnjyezigmay.supabase.co",
    process.env.SUPABASE_PUBLIC_ANON_KEY
  );
  const { data: insertData, error } = await supabase
    .from("quizz")
    .insert({ id: eventLog.args.pollId.toString(), data: response.quizzes_url })
    .select();

  console.log(insertData);
  console.log(error);
}

main().then(() => console.log("Done"));
