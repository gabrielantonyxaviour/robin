import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const GRAPH_CLIENT_URL = "http://127.0.0.1:4000/graphql";

export const graphClient = new ApolloClient({
  uri: GRAPH_CLIENT_URL,
  cache: new InMemoryCache(),
});

export const ROBINX_ADDRESS = "0x057651A8F159B05875c851113eA472B0Deb7bd4D";
export const ROBINX_CORE_ADDRESS = "0x98f862014f5D58bfBcf972695c1b12e9e8821E7A";
export const ROBINX_VERIFIER_ADDRESS =
  "0x95C82Bb347A6ADf97F3B3Bd2B1c57b38E4C5E863";

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
