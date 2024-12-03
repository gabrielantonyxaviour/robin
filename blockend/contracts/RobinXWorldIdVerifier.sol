// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";

/// @title RobinXWorldIdVerifier
/// @notice Verifies World ID proofs and dispatches cross-chain messages.
contract RobinXWorldIdVerifier {
    using ByteHasher for bytes;

    /// @notice Instance of the WorldID router used for proof verification.
    IWorldID internal immutable worldId;

    /// @notice External nullifier used to prevent replay attacks.
    uint256 internal immutable externalNullifier;

    /// @notice The World ID group ID being used for this verifier.
    uint256 internal immutable groupId = 1;

    /// @notice Mapping to store nullifier hashes linked to signals (addresses).
    mapping(address => uint256) internal nullifierHashes;

    /// @notice Instance of the mailbox contract for cross-chain communication.
    IMailbox public mailbox;

    /// @notice Address of the RobinXCore contract on the destination chain.
    address public robinXCore;

    // @notice Address of the public owner.
    address public owner;

    /// @notice Domain ID for the Educhain network.
    uint32 public constant EDUCHAIN_DOMAIN_ID = 656476;

    /// @dev Errors
    error NotOwner(address owner);
    error DuplicateNullifier(uint256 nullifierHash, address signal);
    error InvalidCrosschainCaller(uint32 origin, bytes32 sender);
    error NotMailbox();

    /// @dev Events
    event BridgedVerifiedNullifier(
        bytes32 indexed messageId,
        uint256 indexed nullifierHash,
        address indexed caller
    );

    /// @notice Modifier to restrict access to the owner.
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(owner);
        _;
    }

    /// @param _worldId The WorldID router that will verify the proofs.
    /// @param _appId The World ID application ID.
    /// @param _actionId The World ID action ID.
    /// @param _mailbox The address of the mailbox contract.
    /// @param _robinXCore The address of the RobinXCore contract on the destination chain.
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId,
        IMailbox _mailbox,
        address _robinXCore
    ) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
        mailbox = _mailbox;
        robinXCore = _robinXCore;
        owner = msg.sender;
    }

    function setRobinXCore(address _robinXCore) public onlyOwner {
        robinXCore = _robinXCore;
    }

    /// @notice Verifies a World ID proof and dispatches a message to the RobinXCore contract.
    /// @param signal An arbitrary input from the user, typically the user's wallet address.
    /// @param root The root of the Merkle tree (returned by the World ID widget).
    /// @param nullifierHash The nullifier hash for the proof to prevent double signaling.
    /// @param proof The zero-knowledge proof verifying the user's World ID registration.
    /// @dev Emits a `BridgedVerifiedNullifier` event upon successful verification and dispatch.
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public payable {
        if (nullifierHashes[signal] != 0)
            revert DuplicateNullifier(nullifierHash, signal);

        // Verify the World ID proof.
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // Mark the nullifier hash as used for the signal.
        nullifierHashes[signal] = nullifierHash;

        // Dispatch the cross-chain message to RobinXCore.
        bytes32 messageId = mailbox.dispatch{value: msg.value}(
            EDUCHAIN_DOMAIN_ID,
            addressToBytes32(robinXCore),
            abi.encode(msg.sender, nullifierHash)
        );

        emit BridgedVerifiedNullifier(messageId, nullifierHash, msg.sender);
    }

    /// @notice Converts an address to a bytes32 value.
    /// @param _address The address to convert.
    /// @return The address represented as bytes32.
    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    /// @notice Converts a bytes32 value to an address.
    /// @param _bytes32 The bytes32 value to convert.
    /// @return The bytes32 value represented as an address.
    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
}
