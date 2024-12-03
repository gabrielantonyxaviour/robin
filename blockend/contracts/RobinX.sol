// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title RobinX Token Contract
/// @notice ERC20 token contract for the RobinX ecosystem with controlled minting capabilities.
/// @dev Inherits from OpenZeppelin's ERC20 implementation.
contract RobinX is ERC20 {
    /// @notice Name of the token.
    string public constant token_name = "RobinX";

    /// @notice Symbol of the token.
    string public constant token_symbol = "RX";

    /// @notice Address of the RobinX AI Agent.
    address public robinXAiAgent;

    /// @notice Address of the RobinX Core contract.
    address public coreAddress;

    /// @notice Address of the contract owner.
    address public owner;

    /// @dev Errors for better debugging.
    error NotOwner(address owner);
    error NotRobin(address robinXAiAgent);
    error NotCore(address coreAddress);

    /// @param _robinXAiAgent Address of the RobinX AI Agent.
    /// @param _owner Address of the contract owner.
    constructor(
        address _robinXAiAgent,
        address _owner
    ) ERC20(token_name, token_symbol) {
        robinXAiAgent = _robinXAiAgent;
        coreAddress = msg.sender;
        owner = _owner;
    }

    /// @dev Modifier to restrict function access to the contract owner.
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(owner);
        _;
    }

    /// @dev Modifier to restrict function access to the RobinX AI Agent.
    modifier onlyRobin() {
        if (msg.sender != robinXAiAgent) revert NotRobin(robinXAiAgent);
        _;
    }

    /// @dev Modifier to restrict function access to the RobinX Core contract.
    modifier onlyCore() {
        if (msg.sender != coreAddress) revert NotCore(coreAddress);
        _;
    }

    /// @notice Sets a new RobinX AI Agent address.
    /// @param _robinXAiAgent The new RobinX AI Agent address.
    /// @dev Only callable by the contract owner.
    function setRobin(address _robinXAiAgent) external onlyOwner {
        robinXAiAgent = _robinXAiAgent;
    }

    /// @notice Transfers ownership of the contract to a new address.
    /// @param _newOwner The new owner's address.
    /// @dev Only callable by the current owner.
    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    /// @notice Mints rewards to a specified address.
    /// @param to The address to receive the minted tokens.
    /// @param amount The amount of tokens to mint.
    /// @dev Only callable by the RobinX Core contract.
    function mintRewards(address to, uint256 amount) external onlyCore {
        _mint(to, amount);
    }
}
