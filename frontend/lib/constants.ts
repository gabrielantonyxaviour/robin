import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const GRAPH_CLIENT_URL = "http://127.0.0.1:4000/graphql";

export const graphClient = new ApolloClient({
  uri: GRAPH_CLIENT_URL,
  cache: new InMemoryCache(),
});

export const ROBINX_ADDRESS = "0x057651A8F159B05875c851113eA472B0Deb7bd4D";
export const ROBINX_CORE_ADDRESS = "0x11feDEF3a24F3030147C6755497F775FE283e0cA";
export const ROBINX_VERIFIER_ADDRESS =
  "0xe04647Bb5a851e1c3DE4aEa5f0cc0e4A74c5f27A";

export const coreGraphClient = new ApolloClient({
  uri: "https://7d47-103-170-245-236.ngrok-free.app/subgraphs/name/core",
  cache: new InMemoryCache(),
});

export const verifierGraphClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/30735/robinxworldidverifier/version/latest",
  cache: new InMemoryCache(),
});

export const ROBINX_CORE_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "encryptedResponse",
        type: "string",
      },
    ],
    name: "submitResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const ROBINX_VERIFIER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "signal",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "root",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
      {
        internalType: "uint256[8]",
        name: "proof",
        type: "uint256[8]",
      },
    ],
    name: "verifyAndExecute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
