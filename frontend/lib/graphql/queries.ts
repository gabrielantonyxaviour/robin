import { gql } from "@apollo/client";

export const GET_WORLDCOIN_COMMITMENT = gql`
  query GetWorldcoinCommitment($address: String!) {
    users(where: { address_contains: $address }) {
      id
      address
    }
  }
`;

export const GET_WORLDCOIN_VERIFED = gql`
  query GetWorldcoinVerified($address: String!) {
    bridgedVerifiedNullifiers(where: { caller_contains: $address }) {
      caller
      messageId
      nullifierHash
      transactionHash
    }
  }
`;

export const GET_ACTIVE_QUIZZES = gql`
  query GetActiveQuizzes($userId: ID!) {
    quizzes(where: { responses_: { user_not: $userId } }) {
      id
      metadata
      totalResponses
      createdAt
    }
  }
`;

export const GET_SUBMITTED_QUIZZES = gql`
  query GetSubmittedQuizzes($userId: ID!) {
    user(id: $userId) {
      responses {
        quiz {
          id
          metadata
          createdAt
        }
        encryptedResponse
        reward {
          score
          amount
          receiver
        }
      }
    }
  }
`;

export const GET_QUIZZ = gql`
  query GetQuizz($id: ID!) {
    quizzes(where: { id: $id }) {
      id
      metadata
      totalResponses
      createdAt
    }
  }
`;
