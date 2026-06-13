// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { DubaiRealEstateToken } from "./DubaiRealEstateToken.sol";

/**
 * @title DubaiRealEstateTokenV2
 * @author Steph Rayan
 * @notice V2 implementation used to prove UUPS upgrade preserves storage.
 * @dev Adds a public version marker. All other logic is inherited from V1.
 */
contract DubaiRealEstateTokenV2 is DubaiRealEstateToken {
    /// @notice Version identifier for upgrade verification.
    uint256 public constant VERSION = 2;

    /**
     * @notice Returns the contract version.
     * @dev Used in tests to confirm the proxy now delegates to V2.
     */
    function version() external pure returns (uint256) {
        return VERSION;
    }
}
