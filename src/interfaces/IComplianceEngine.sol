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
    function isCompliant(address from, address to, uint256 amount) external view returns (bool);
    function canCreate(address to, uint256 amount) external view returns (bool);
    function canDestroy(address from, uint256 amount) external view returns (bool);

    // Stateful hooks
    function transferred(address from, address to, uint256 amount) external;
    function created(address to, uint256 amount) external;
    function destroyed(address from, uint256 amount) external;

    // Freeze management
    function freezeInvestor(address investor, string calldata reason) external;
    function unfreezeInvestor(address investor) external;
    function isFrozen(address investor) external view returns (bool);

    // Module management
    function getModules() external view returns (address[] memory);
    function isModuleBound(address module) external view returns (bool);
    function bindToken(address token) external;
    function unbindToken(address token) external;
    function addModule(address module) external;
    function removeModule(address module) external;
}
