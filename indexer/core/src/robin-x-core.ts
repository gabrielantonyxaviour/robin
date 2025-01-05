import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  QuizCreated as QuizCreatedEvent,
  ResponseSubmitted as ResponseSubmittedEvent,
  RewardsMinted as RewardsMintedEvent,
} from "../generated/RobinXCore/RobinXCore";
import {
  quiz as Quiz,
  response as Response,
  user as User,
} from "../generated/schema";

export function handleQuizCreated(event: QuizCreatedEvent): void {
  let quiz = new Quiz(event.params.pollId.toHexString());
  quiz.metadata = event.params.metadata;
  quiz.totalResponses = BigInt.fromI32(0);
  quiz.totalRewardsDistributed = BigInt.fromI32(0);
  quiz.totalPointsScored = BigInt.fromI32(0);
  quiz.topScoreTokenReward = event.params.tokenRewardAmount;
  quiz.createdAt = event.block.timestamp;
  quiz.validity = event.params.validity;
  quiz.transactionHash = event.transaction.hash;
  quiz.save();
}

export function handleResponseSubmitted(event: ResponseSubmittedEvent): void {
  let user = User.load(event.params.caller.toHexString());
  if (!user) {
    user = new User(event.params.caller.toHexString());
    user.totalResponses = BigInt.fromI32(0);
    user.totalRewards = BigInt.fromI32(0);
    user.totalPointsScored = BigInt.fromI32(0);
  }

  let response = new Response(
    event.params.pollId.toHexString() + "-" + event.params.caller.toHexString()
  );
  response.quiz = event.params.pollId.toHexString();
  response.user = event.params.caller.toHexString();
  response.encryptedResponse = event.params.encryptedResponse;
  response.responseTxHash = event.transaction.hash;
  response.save();

  user.totalResponses = user.totalResponses.plus(BigInt.fromI32(1));
  user.save();

  let quiz = Quiz.load(event.params.pollId.toHexString());
  if (quiz) {
    quiz.totalResponses = quiz.totalResponses.plus(BigInt.fromI32(1));
    quiz.save();
  }
}

export function handleRewardsMinted(event: RewardsMintedEvent): void {
  let response = Response.load(
    event.params.pollId.toHexString() +
      "-" +
      event.params.receiver.toHexString()
  );
  if (response) {
    response.amount = event.params.amount;
    response.score = BigInt.fromI32(event.params.score);
    response.rewardTxHash = event.transaction.hash;
    response.save();
  }

  let user = User.load(event.params.receiver.toHexString());

  if (user) {
    user.totalRewards = user.totalRewards.plus(event.params.amount);
    user.totalPointsScored = user.totalPointsScored.plus(
      BigInt.fromI32(event.params.score)
    );
    user.save();
  }

  let quiz = Quiz.load(event.params.pollId.toHexString());
  if (quiz) {
    quiz.totalRewardsDistributed = quiz.totalRewardsDistributed.plus(
      event.params.amount
    );
    quiz.totalPointsScored = quiz.totalPointsScored.plus(
      BigInt.fromI32(event.params.score)
    );
    quiz.save();
  }
}
