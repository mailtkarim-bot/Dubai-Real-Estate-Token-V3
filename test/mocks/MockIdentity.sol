// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title MockIdentity
 * @notice Dummy identity contract to pass the extcodesize > 0 check.
 * In production this would be an ONCHAINID ERC-734/735 contract.
 */
contract MockIdentity {
    // Intentionally empty. Its existence at an address is sufficient.
}
