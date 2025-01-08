import { Address } from "viem";

export type Quest = {
  id: number;
  questId: string;
  title: string;
  createdAt: string;
  validity: number;
  topScoreTokenReward: number;
  transactionHash: string;
};

export type QuestWithResponse = {
  id: number;
  questId: string;
  title: string;
  createdAt: string;
  validity: number;
  response: {
    amount: string;
    score: string;
    encryptedResponse: string;
    rewardTxHash: string;
    responseTxHash: string;
  };
};

export type Token = {
  address: Address; // The address of the token contract
  chainId: number; // The chain id of the token contract
  decimals: number; // The number of token decimals
  image: string | null; // A string url of the token logo
  name: string;
  symbol: string; // A ticker symbol or shorthand, up to 11 characters
};

// Define types for the queries
export interface WorldcoinCommitmentData {
  users: { id: string; address: string }[];
}

export interface WorldcoinVerifiedData {
  bridgedVerifiedNullifiers: {
    caller: string;
    messageId: string;
    nullifierHash: string;
    transactionHash: string;
  }[];
}

export interface ActiveQuizzesData {
  quizzes: {
    id: string;
    metadata: string;
    totalResponses: number;
    createdAt: string;
  }[];
}

export interface SubmittedQuizzesData {
  user: {
    responses: {
      quiz: {
        id: string;
        metadata: string;
        createdAt: string;
      };
      encryptedResponse: string;
      reward: {
        score: number;
        amount: string;
        receiver: string;
      };
    }[];
  };
}

export interface QuizzData {
  quizzes: {
    id: string;
    metadata: string;
    totalResponses: number;
    createdAt: string;
  }[];
}
