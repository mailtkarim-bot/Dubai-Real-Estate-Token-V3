// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IDividendAware
 * @author Steph Rayan
 * @notice Minimal interface exposing dividend liabilities of a token.
 * @dev Used by IdentityRegistry to prevent identity deletion while
 *      an investor still has unclaimed dividends.
 */
interface IDividendAware {
    /**
     * @notice Returns the total unclaimed dividends for an account,
     *         including both pending sync and already-synced amounts.
     * @param account The investor address.
     * @return claimable The total dividend liability.
     */
    function pendingDividendsOf(address account) external view returns (uint256 claimable);
}
