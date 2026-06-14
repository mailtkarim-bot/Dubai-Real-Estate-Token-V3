// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IComplianceEngine
 * @author Steph Rayan
 * @notice Interface for the compliance engine with stateful hooks.
 * @dev v2 adds stateful hooks (transferred, created, destroyed) for
 *      modular compliance tracking (daily limits, transfer counts, etc.).
 */
interface IComplianceEngine {
    event TokenBound(address indexed token);
    event TokenUnbound(address indexed token);
    event ModuleAdded(address indexed module);
    event ModuleRemoved(address indexed module);

    // View checks
    /**
     * @notice Checks whether a token transfer satisfies all compliance rules.
     * @param from The sender address.
     * @param to The recipient address.
     * @param amount The amount to transfer.
     * @return True if the transfer is compliant, false otherwise.
     */
    function isCompliant(address from, address to, uint256 amount) external view returns (bool);

    /**
     * @notice Checks whether a minting operation is allowed for the recipient.
     * @param to The address receiving the minted tokens.
     * @param amount The amount to mint.
     * @return True if minting is allowed, false otherwise.
     */
    function canCreate(address to, uint256 amount) external view returns (bool);

    /**
     * @notice Checks whether a burn operation is allowed for the holder.
     * @param from The address whose tokens will be burned.
     * @param amount The amount to burn.
     * @return True if burning is allowed, false otherwise.
     */
    function canDestroy(address from, uint256 amount) external view returns (bool);

    // Stateful hooks
    /**
     * @notice Hook called after a successful transfer to update compliance state.
     * @param from The sender address.
     * @param to The recipient address.
     * @param amount The transferred amount.
     */
    function transferred(address from, address to, uint256 amount) external;

    /**
     * @notice Hook called after a successful mint to update compliance state.
     * @param to The address receiving the minted tokens.
     * @param amount The minted amount.
     */
    function created(address to, uint256 amount) external;

    /**
     * @notice Hook called after a successful burn to update compliance state.
     * @param from The address whose tokens were burned.
     * @param amount The burned amount.
     */
    function destroyed(address from, uint256 amount) external;

    // Freeze management
    /**
     * @notice Freezes an investor, blocking transfers from/to the frozen address.
     * @param investor The address to freeze.
     * @param reason A human-readable reason for the freeze.
     */
    function freezeInvestor(address investor, string calldata reason) external;

    /**
     * @notice Unfreezes a previously frozen investor.
     * @param investor The address to unfreeze.
     */
    function unfreezeInvestor(address investor) external;

    /**
     * @notice Returns whether an investor is currently frozen.
     * @param investor The address to check.
     * @return True if the investor is frozen, false otherwise.
     */
    function isFrozen(address investor) external view returns (bool);

    // Module management
    /**
     * @notice Returns the list of compliance modules currently bound to the engine.
     * @return An array of module addresses.
     */
    function getModules() external view returns (address[] memory);

    /**
     * @notice Returns whether a given module is bound to the engine.
     * @param module The module address to check.
     * @return True if the module is bound, false otherwise.
     */
    function isModuleBound(address module) external view returns (bool);

    /**
     * @notice Binds the compliance engine to a token contract.
     * @param token The token address to bind.
     */
    function bindToken(address token) external;

    /**
     * @notice Unbinds a previously bound token contract.
     * @param token The token address to unbind.
     */
    function unbindToken(address token) external;

    /**
     * @notice Adds a compliance module to the engine.
     * @param module The module address to add.
     */
    function addModule(address module) external;

    /**
     * @notice Removes a compliance module from the engine.
     * @param module The module address to remove.
     */
    function removeModule(address module) external;
}
