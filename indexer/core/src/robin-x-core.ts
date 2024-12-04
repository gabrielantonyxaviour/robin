import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  DailyQuizStarted as DailyQuizStartedEvent,
  VerifiedNullifier as VerifiedNullifierEvent,
  ResponseSubmitted as ResponseSubmittedEvent,
  RewardsMinted as RewardsMintedEvent,
  RewardReceiverAddressSet as RewardReceiverAddressSetEvent,
} from "../generated/RobinXCore/RobinXCore";
import {
  quiz as Quiz,
  response as Response,
  user as User,
  reward as Reward,
} from "../generated/schema";

export function handleVerifiedNullifier(event: VerifiedNullifierEvent): void {
  let userId = event.params.nullifierHash.toString();
  let user = User.load(userId);

  if (!user) {
    user = new User(userId);
    user.totalResponses = BigInt.fromI32(0);
    user.totalRewards = BigInt.fromI32(0);
    user.averageScore = BigInt.fromI32(0);
    user.addresses = [event.params.caller];
  } else {
    let addresses = user.addresses;
    addresses.push(event.params.caller);
    user.addresses = addresses;
  }

  user.save();
}

export function handleDailyQuizStarted(event: DailyQuizStartedEvent): void {
  let quiz = new Quiz(event.params.pollId.toString());
  quiz.metadata = event.params.metadata;
  quiz.totalResponses = BigInt.fromI32(0);
  quiz.totalRewardsDistributed = BigInt.fromI32(0);
  quiz.createdAt = event.block.timestamp;
  quiz.transactionHash = event.transaction.hash;
  quiz.save();
}

export function handleResponseSubmitted(event: ResponseSubmittedEvent): void {
  let user = User.load(event.params.nullifierHash.toString());
  if (!user) return;

  let responseId =
    event.params.pollId.toString() +
    "-" +
    event.params.nullifierHash.toString();
  let response = new Response(responseId);
  response.quiz = event.params.pollId.toString();
  response.user = event.params.nullifierHash.toString();
  response.encryptedResponse = event.params.encryptedResponse;
  response.transactionHash = event.transaction.hash;
  response.save();

  user.totalResponses = user.totalResponses.plus(BigInt.fromI32(1));
  user.save();

  let quiz = Quiz.load(event.params.pollId.toString());
  if (quiz) {
    quiz.totalResponses = quiz.totalResponses.plus(BigInt.fromI32(1));
    quiz.save();
  }
}

export function handleRewardsMinted(event: RewardsMintedEvent): void {
  let rewardId =
    event.params.pollId.toString() +
    "-" +
    event.params.receiverNullifierHash.toString();
  let reward = new Reward(rewardId);
  reward.quiz = event.params.pollId.toString();
  reward.response = rewardId;
  reward.score = event.params.score;
  reward.amount = event.params.amount;
  reward.transactionHash = event.transaction.hash;
  reward.save();

  let quiz = Quiz.load(event.params.pollId.toString());
  if (quiz) {
    quiz.totalRewardsDistributed = quiz.totalRewardsDistributed.plus(
      event.params.amount
    );
    quiz.save();
  }
}

export function handleRewardReceiverAddressSet(
  event: RewardReceiverAddressSetEvent
): void {
  let reward = Reward.load("-" + event.params.nullifierHash.toString());
  if (reward) {
    reward.receiver = event.params.receiver;
    reward.save();

    let user = User.load(event.params.nullifierHash.toString());
    if (user) {
      user.totalRewards = user.totalRewards.plus(reward.amount);
      let currentScore = user.averageScore.times(user.totalResponses);
      user.averageScore = currentScore
        .plus(reward.score)
        .div(user.totalResponses);
      user.save();
    }
  }
}
