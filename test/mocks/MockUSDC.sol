// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Fake USDC for testing dividends.
 * @dev 6 decimals like real USDC. Mint is owner-only.
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
