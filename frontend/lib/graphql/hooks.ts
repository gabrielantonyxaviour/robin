import { useQuery } from "@apollo/client";
import {
  GET_WORLDCOIN_COMMITMENT,
  GET_WORLDCOIN_VERIFED,
  GET_ACTIVE_QUIZZES,
  GET_SUBMITTED_QUIZZES,
  GET_QUIZZ,
} from "./queries";

import {
  WorldcoinCommitmentData,
  WorldcoinVerifiedData,
  ActiveQuizzesData,
  SubmittedQuizzesData,
  QuizzData,
} from "../type";
import { coreGraphClient, verifierGraphClient } from "../constants";

// Hook for GET_WORLDCOIN_COMMITMENT
export const useGetWorldcoinCommitment = (address: string | undefined) => {
  const { loading, error, data } = useQuery<WorldcoinCommitmentData>(
    GET_WORLDCOIN_COMMITMENT,
    {
      variables: { address },
      skip: !address,
      client: coreGraphClient,
    }
  );

  return { loading, error, data };
};

// Hook for GET_WORLDCOIN_VERIFED
export const useGetWorldcoinVerified = (address: string | undefined) => {
  const { loading, error, data } = useQuery<WorldcoinVerifiedData>(
    GET_WORLDCOIN_VERIFED,
    {
      variables: { address },
      skip: !address,
      client: verifierGraphClient,
    }
  );

  return { loading, error, data };
};

// Hook for GET_ACTIVE_QUIZZES
export const useGetActiveQuizzes = (userId: string | undefined) => {
  const { loading, error, data } = useQuery<ActiveQuizzesData>(
    GET_ACTIVE_QUIZZES,
    {
      variables: { userId },
      skip: !userId,
      client: coreGraphClient,
    }
  );

  return { loading, error, data };
};

// Hook for GET_SUBMITTED_QUIZZES
export const useGetSubmittedQuizzes = (userId: string | undefined) => {
  const { loading, error, data } = useQuery<SubmittedQuizzesData>(
    GET_SUBMITTED_QUIZZES,
    {
      variables: { userId },
      skip: !userId,
      client: coreGraphClient,
    }
  );

  return { loading, error, data };
};

// Hook for GET_QUIZZ
export const useGetQuizz = (id: string | undefined) => {
  const { loading, error, data } = useQuery<QuizzData>(GET_QUIZZ, {
    variables: { id },
    skip: !id,
    client: coreGraphClient,
  });

  return { loading, error, data };
};
