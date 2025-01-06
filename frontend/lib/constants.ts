export const ROBINX_ADDRESS = "0x6c19E9a9299e7346102da7E735F3b95e87f25DEe";
export const ROBINX_CORE_ADDRESS = "0x868d93b0Da22444100ADF128424bafF8B26500ff";

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
