const { createClient, fetchExchange } = require("urql");

const APIURL = "http://localhost:8000/subgraphs/name/core";

const GET_QUIZZES = `
query GetQuizzes {
    quizzes(orderBy:createdAt, orderDirection:desc) {
      id
      metadata
      totalResponses
      createdAt
      validity
      transactionHash
      topScoreTokenReward
    }
  }

`;

const GET_SUBMITTED_QUIZZES = `
  query GetSubmittedQuizzes($userId: ID!) {
    users(where: {id: $userId}) {
      responses {
        quiz {
          id
          metadata
          createdAt
          totalResponses
          topScoreTokenReward
          transactionHash
          validity
        }
        encryptedResponse
        rewardTxHash
        responseTxHash
        amount
        score
      }
    }
  }
`;

const GET_QUIZZ = `
  query GetQuizz($id: ID!) {
    quizzes(where: { id: $id }) {
      id
      metadata
      totalResponses
      createdAt
    }
  }
`;

const GET_QUIZ_LEADERBORD = `
  query GetQuizLearboard($id: ID!) {
    responses(where: { quiz: $id }) {
      id
      amount
      score
      rewardTxHash
    }
  }
`;

const GET_LEADERBOARD = `
  query GetLeaderboard {
    users {
      id
      totalResponses
      totalRewards
      totalPointsScored
    }
  }
`;

const client = createClient({
  url: APIURL,
  exchanges: [fetchExchange],
});

async function getQuiz(quizId) {
  try {
    const { data } = await client.query(GET_QUIZZ, { id: quizId }).toPromise();
    return data.quizzes[0] || null;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
}

async function getLeaderboard() {
  try {
    const { data } = await client.query(GET_LEADERBOARD).toPromise();
    return data.users || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

async function getQuizzes() {
  try {
    const { data } = await client.query(GET_QUIZZES).toPromise();
    return data.quizzes || [];
  } catch (error) {
    console.error("Error fetching active quizzes:", error);
    throw error;
  }
}

async function getCompletedQuizzes(address) {
  try {
    const { data } = await client
      .query(GET_SUBMITTED_QUIZZES, { userId: address.toLowerCase() })
      .toPromise();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching completed quizzes:", error);
    throw error;
  }
}

async function getQuizLeaderboard(quizId) {
  try {
    const { data } = await client
      .query(GET_QUIZ_LEADERBORD, { id: quizId })
      .toPromise();
    return data.responses || [];
  } catch (error) {
    console.error("Error fetching quiz leaderboard:", error);
    throw error;
  }
}

module.exports = {
  getQuiz,
  getLeaderboard,
  getQuizLeaderboard,
  getCompletedQuizzes,
  getQuizzes,
};
