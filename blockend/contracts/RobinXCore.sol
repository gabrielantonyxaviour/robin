// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./RobinX.sol";
import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";

/// @title RobinXCore
/// @author Gabriel Antony Xaviour
/// @notice Core contract for managing polls, responses, and rewards with cross-chain verification.
contract RobinXCore {
    /// @notice Address of the RobinX AI agent.
    address public robinXAiAgent;

    /// @notice RobinX token contract instance.
    RobinX public robinX;

    /// @notice Address of the contract owner.
    address public owner;

    /// @notice Address of the public world ID verifier.
    address public robinXWorldIdVerifier;

    /// @notice Count of polls created.
    uint256 public pollCount;

    /// @notice Mapping of poll IDs to metadata.
    mapping(uint256 => string) public polls;

    // @notice Mapping of poll IDs to it's validity.
    mapping(uint256 => uint256) public pollValidity;

    /// @notice Mapping of addresses to verified nullifier hashes.
    mapping(address => uint256) public verifiedNullifiers;

    /// @notice Mapping of nullifier hashes to reward receivers.
    mapping(uint256 => address) public rewardReceivers;

    /// @notice Mapping of poll rewards.
    /// @dev pollId => nullifierHash => reward amount.
    mapping(uint256 => mapping(uint256 => uint256)) public rewards;

    /// @notice Mapping of poll responses.
    /// @dev pollId => nullifierHash => encrypted response.
    mapping(uint256 => mapping(uint256 => string)) public pollResponses;

    /// @notice Mailbox contract for cross-chain communication.
    IMailbox public mailbox;

    /// @notice Domain ID for the Sepolia testnet.
    uint32 public constant SEPOLIA_DOMAIN_ID = 11155111;

    /// @dev Errors
    error NotOwner(address requiredOwner);
    error InvalidCrosschainCaller(uint32 origin, address sender);
    error NotMailbox();
    error UnverifiedCaller(uint256 pollId, address sender);
    error AlreadyAttempted(
        uint256 pollId,
        address caller,
        uint256 nullifierHash
    );
    error UnverifiedReceiverAddress(uint256 nullifierHash, address receiver);
    error AlreadyRewarded(uint256 pollId, uint256 receiverNullifierHash);
    error InvalidPollId(uint256 pollId);
    error NotRobin(address requiredRobinXAiAgent);

    /// @dev Events
    event QuizCreated(uint256 pollId, uint256 validity, string metadata);
    event VerifiedNullifier(uint256 nullifierHash, address caller);
    event ResponseSubmitted(
        uint256 pollId,
        address caller,
        uint256 nullifierHash,
        string encryptedResponse
    );
    event RewardsMinted(
        uint256 pollId,
        uint256 receiverNullifierHash,
        uint256 score,
        uint256 amount
    );
    event RewardReceiverAddressSet(uint256 nullifierHash, address receiver);

    /// @notice Modifier to restrict access to the owner.
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(owner);
        _;
    }

    /// @notice Modifier to restrict access to the mailbox.
    modifier onlyMailbox() {
        if (msg.sender != address(mailbox)) revert NotMailbox();
        _;
    }

    /// @notice Modifier to validate cross-chain calls.
    modifier onlyRobinXWorldIdVerifier(address sender, uint32 origin) {
        if (origin != SEPOLIA_DOMAIN_ID || sender != robinXWorldIdVerifier)
            revert InvalidCrosschainCaller(origin, sender);
        _;
    }

    /// @notice Modifier to restrict access to the RobinX AI agent.
    modifier onlyRobin() {
        if (msg.sender != robinXAiAgent) revert NotRobin(robinXAiAgent);
        _;
    }

    /// @param _robinXAiAgent Address of the RobinX AI agent.
    /// @param _mailbox Address of the mailbox contract.
    constructor(address _robinXAiAgent, IMailbox _mailbox) {
        robinXAiAgent = _robinXAiAgent;
        robinX = new RobinX(_robinXAiAgent, msg.sender);
        owner = msg.sender;
        mailbox = _mailbox;
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

    function setRobinXWorldIdVerifier(address _verifier) external onlyOwner {
        robinXWorldIdVerifier = _verifier;
    }

    /// @notice Creates a new poll with given metadata.
    /// @param _metadata The metadata for the poll.
    function createPoll(
        string memory _metadata,
        uint256 validity
    ) external onlyRobin {
        polls[pollCount] = _metadata;
        pollValidity[pollCount] = validity;
        emit QuizCreated(pollCount, validity, _metadata);
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
        uint256 nullifierHash = verifiedNullifiers[msg.sender];
        if (nullifierHash == 0) revert UnverifiedCaller(pollId, msg.sender);
        if (bytes(pollResponses[pollId][nullifierHash]).length > 0)
            revert AlreadyAttempted(pollId, msg.sender, nullifierHash);

        pollResponses[pollId][nullifierHash] = encryptedResponse;

        emit ResponseSubmitted(
            pollId,
            msg.sender,
            nullifierHash,
            encryptedResponse
        );
    }

    /// @notice Mints rewards for a verified poll response.
    /// @param pollId The ID of the poll.
    /// @param receiverNullifierHash The nullifier hash of the receiver.
    /// @param score The score of the response.
    /// @param amount The reward amount.
    function mintRewards(
        uint256 pollId,
        uint256 receiverNullifierHash,
        uint256 score,
        uint256 amount
    ) external onlyRobin {
        if (pollId >= pollCount) revert InvalidPollId(pollId);
        if (rewards[pollId][receiverNullifierHash] != 0)
            revert AlreadyRewarded(pollId, receiverNullifierHash);

        rewards[pollId][receiverNullifierHash] = amount;
        address receiver = rewardReceivers[receiverNullifierHash];
        robinX.mintRewards(receiver, amount);

        emit RewardsMinted(pollId, receiverNullifierHash, score, amount);
    }

    /// @notice Sets the reward receiver address for a nullifier hash.
    /// @param _receiver The address of the receiver.
    /// @param _nullifierHash The nullifier hash.
    function setRewardReceiverAddress(
        address _receiver,
        uint256 _nullifierHash
    ) external {
        uint256 callerNullifierHash = verifiedNullifiers[msg.sender];
        if (callerNullifierHash == 0 || callerNullifierHash != _nullifierHash)
            revert UnverifiedReceiverAddress(_nullifierHash, _receiver);

        rewardReceivers[_nullifierHash] = _receiver;

        emit RewardReceiverAddressSet(_nullifierHash, _receiver);
    }

    /// @notice Handles cross-chain verification of nullifiers.
    /// @param _origin The origin domain ID.
    /// @param _sender The sender address in bytes32 format.
    /// @param _data The encoded data (nullifierHash, caller address).
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _data
    )
        external
        payable
        onlyMailbox
        onlyRobinXWorldIdVerifier(bytes32ToAddress(_sender), _origin)
    {
        (address caller, uint256 nullifierHash) = abi.decode(
            _data,
            (address, uint256)
        );
        verifiedNullifiers[caller] = nullifierHash;

        if (rewardReceivers[nullifierHash] == address(0)) {
            rewardReceivers[nullifierHash] = caller;
        }

        emit VerifiedNullifier(nullifierHash, caller);
    }

    /// @notice Converts an address to bytes32.
    /// @param _address The address to convert.
    /// @return The converted bytes32 representation.
    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    /// @notice Converts bytes32 to an address.
    /// @param _bytes32 The bytes32 to convert.
    /// @return The converted address.
    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
}
