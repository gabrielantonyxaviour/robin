// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RobinX.sol";
import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";

/// @title RobinXCore
/// @author Gabriel Antony Xaviour
/// @notice Core contract for managing polls, responses, and results with cross-chain verification.
contract RobinXCore {
    struct Poll {
        string metadata;
        uint256 tokenReward;
        uint256 validity;
    }

    struct Result {
        uint8 score;
        uint256 reward;
    }

    /// @notice Address of the RobinX AI agent.
    address public robinXAiAgent;

    /// @notice RobinX token contract instance.
    RobinX public robinX;

    /// @notice Address of the contract owner.
    address public owner;

    /// @notice Count of polls created.
    uint256 public pollCount;

    /// @notice Mapping of poll IDs to metadata.
    mapping(uint256 => Poll) public polls;

    /// @notice Mapping of poll results.
    /// @dev pollId => nullifierHash => reward amount.
    mapping(uint256 => mapping(address => Result)) public results;

    /// @notice Mapping of poll responses.
    /// @dev pollId => nullifierHash => encrypted response.
    mapping(uint256 => mapping(address => string)) public pollResponses;

    /// @dev Errors
    error NotOwner(address requiredOwner);
    error AlreadyAttempted(uint256 pollId, address caller);
    error InvalidPollId(uint256 pollId);
    error NotRobin(address requiredRobinXAiAgent);

    /// @dev Events
    event QuizCreated(
        uint256 pollId,
        uint256 validity,
        uint256 tokenRewardAmount,
        string metadata
    );
    event ResponseSubmitted(
        uint256 pollId,
        address caller,
        string encryptedResponse
    );
    event RewardsMinted(
        uint256 pollId,
        address receiver,
        uint8 score,
        uint256 amount
    );

    /// @notice Modifier to restrict access to the owner.
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(owner);
        _;
    }

    /// @notice Modifier to restrict access to the RobinX AI agent.
    modifier onlyRobin() {
        if (msg.sender != robinXAiAgent) revert NotRobin(robinXAiAgent);
        _;
    }

    /// @param _robinXAiAgent Address of the RobinX AI agent.
    constructor(address _robinXAiAgent) {
        robinXAiAgent = _robinXAiAgent;
        robinX = new RobinX(_robinXAiAgent, msg.sender);
        owner = msg.sender;
    }

    /// @notice Sets a new RobinX AI agent.
    /// @param _robinXAiAgent The new AI agent address.
    function setRobin(address _robinXAiAgent) external onlyOwner {
        robinXAiAgent = _robinXAiAgent;
    }

    /// @notice Sets a new contract owner.
    /// @param _newOwner The new owner address.
    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    /// @notice Creates a new poll with given metadata.
    /// @param _metadata The metadata for the poll.
    function createPoll(
        string memory _metadata,
        uint256 tokenRewardAmount,
        uint256 validity
    ) external onlyRobin {
        polls[pollCount] = Poll(_metadata, tokenRewardAmount, validity);
        emit QuizCreated(pollCount, validity, tokenRewardAmount, _metadata);
        pollCount++;
    }

    /// @notice Submits a response to a specific poll.
    /// @param pollId The ID of the poll.
    /// @param encryptedResponse The encrypted response for the poll.
    function submitResponse(
        uint256 pollId,
        string memory encryptedResponse
    ) external {
        if (pollId >= pollCount) revert InvalidPollId(pollId);
        if (bytes(pollResponses[pollId][msg.sender]).length > 0)
            revert AlreadyAttempted(pollId, msg.sender);
        pollResponses[pollId][msg.sender] = encryptedResponse;
        emit ResponseSubmitted(pollId, msg.sender, encryptedResponse);
    }

    /// @notice Mints results for a verified poll response.
    /// @param pollId The ID of the poll.
    /// @param receiver The address of the receiver.
    /// @param score The score of the response.
    function mintRewards(
        uint256 pollId,
        address receiver,
        uint8 score
    ) external onlyRobin {
        if (pollId >= pollCount) revert InvalidPollId(pollId);

        Poll memory poll = polls[pollId];
        uint256 rewardAmount = (score * poll.tokenReward) / 100;
        results[pollId][receiver] = Result(score, rewardAmount);
        robinX.mintRewards(receiver, rewardAmount);

        emit RewardsMinted(pollId, receiver, score, rewardAmount);
    }
}
