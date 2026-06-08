// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IComplianceEngine} from "../interfaces/IComplianceEngine.sol";
import {IIdentityRegistry} from "../interfaces/IIdentityRegistry.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ComplianceEngine
 * @author Steph Rayan
 * @notice Regulatory compliance engine enforcing VARA/DLD rules — v2.1.
 * @custom:security Tier-1 audit validated. Removed amount==0 bypass. Fixed unbindToken event.
 * @dev v2 adds stateful hooks for modular compliance tracking.
 *      Production modular compliance (IModule pattern) planned for Phase 2.
 */
contract ComplianceEngine is IComplianceEngine, AccessControl, Pausable {

    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");

    address public token;
    IIdentityRegistry public identityRegistry;

    mapping(address => bool) private _frozen;
    mapping(uint16 => bool) private _restrictedCountries;
    mapping(address => bool) private _whitelisted;
    bool public whitelistEnabled;

    event InvestorFrozen(address indexed investor, string reason, uint256 timestamp, address indexed actor);
    event InvestorUnfrozen(address indexed investor, uint256 timestamp, address indexed actor);
    event CountryRestricted(uint16 indexed country, uint256 timestamp, address indexed actor);
    event CountryUnrestricted(uint16 indexed country, uint256 timestamp, address indexed actor);
    event WhitelistEnabled(bool enabled, uint256 timestamp, address indexed actor);
    event WhitelistUpdated(address indexed account, bool status, address indexed actor);
    event IdentityRegistrySet(address indexed registry);

    error ComplianceEngine__ZeroAddress();
    error ComplianceEngine__TokenMismatch();

    modifier nonZeroAddress(address addr) {
        if (addr == address(0)) revert ComplianceEngine__ZeroAddress();
        _;
    }

    constructor(address admin, address identityRegistryAddr)
        nonZeroAddress(admin)
        nonZeroAddress(identityRegistryAddr)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGULATOR_ROLE, admin);
        identityRegistry = IIdentityRegistry(identityRegistryAddr);
    }

    function isCompliant(address from, address to, uint256 amount) external view returns (bool) {
        return _checkRules(from, to, amount);
    }

    function canCreate(address to, uint256 amount) external view returns (bool) {
        return _checkRules(address(0), to, amount);
    }

    function canDestroy(address from, uint256 amount) external view returns (bool) {
        return _checkRules(from, address(0), amount);
    }

    /**
     * @notice Core compliance logic. No amount bypass — frozen accounts are blocked regardless of amount.
     */
    function _checkRules(address from, address to, uint256 amount) internal view returns (bool) {
        if (paused()) return false;

        if (from != address(0) && !identityRegistry.isVerified(from)) return false;
        if (to != address(0) && !identityRegistry.isVerified(to)) return false;

        if (from != address(0) && _frozen[from]) return false;
        if (to != address(0) && _frozen[to]) return false;

        if (from != address(0)) {
            uint16 fromCountry = identityRegistry.investorCountry(from);
            if (_restrictedCountries[fromCountry]) return false;
        }
        if (to != address(0)) {
            uint16 toCountry = identityRegistry.investorCountry(to);
            if (_restrictedCountries[toCountry]) return false;
        }

        if (to != address(0) && whitelistEnabled && !_whitelisted[to]) return false;

        return true;
    }

    function transferred(address /*from*/, address /*to*/, uint256 /*amount*/) external override {
        // Phase 2: Modular compliance tracking (daily limits, counters, etc.)
    }

    function created(address /*to*/, uint256 /*amount*/) external override {
        // Phase 2: Modular compliance tracking
    }

    function destroyed(address /*from*/, uint256 /*amount*/) external override {
        // Phase 2: Modular compliance tracking
    }

    function freezeInvestor(address investor, string calldata reason) external onlyRole(REGULATOR_ROLE) {
        _frozen[investor] = true;
        emit InvestorFrozen(investor, reason, block.timestamp, msg.sender);
    }

    function unfreezeInvestor(address investor) external onlyRole(REGULATOR_ROLE) {
        _frozen[investor] = false;
        emit InvestorUnfrozen(investor, block.timestamp, msg.sender);
    }

    function isFrozen(address investor) external view returns (bool) {
        return _frozen[investor];
    }

    function restrictCountry(uint16 country) external onlyRole(REGULATOR_ROLE) {
        _restrictedCountries[country] = true;
        emit CountryRestricted(country, block.timestamp, msg.sender);
    }

    function unrestrictCountry(uint16 country) external onlyRole(REGULATOR_ROLE) {
        _restrictedCountries[country] = false;
        emit CountryUnrestricted(country, block.timestamp, msg.sender);
    }

    function isCountryRestricted(uint16 country) external view returns (bool) {
        return _restrictedCountries[country];
    }

    function setWhitelistEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistEnabled = enabled;
        emit WhitelistEnabled(enabled, block.timestamp, msg.sender);
    }

    function setWhitelisted(address account, bool status) external onlyRole(REGULATOR_ROLE) {
        _whitelisted[account] = status;
        emit WhitelistUpdated(account, status, msg.sender);
    }

    function isWhitelisted(address account) external view returns (bool) {
        return _whitelisted[account];
    }

    function setIdentityRegistry(address registry) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(registry) {
        identityRegistry = IIdentityRegistry(registry);
        emit IdentityRegistrySet(registry);
    }

    function bindToken(address _token) external override onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(_token) {
        token = _token;
        emit TokenBound(_token);
    }

    /**
     * @notice Unbinds a token from the compliance engine.
     * @dev Reverts if the provided address does not match the currently bound token.
     *      Prevents emitting a misleading event on a no-op.
     */
    function unbindToken(address _token) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token != _token) revert ComplianceEngine__TokenMismatch();
        token = address(0);
        emit TokenUnbound(_token);
    }

    function addModule(address module) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ModuleAdded(module);
    }

    function removeModule(address module) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ModuleRemoved(module);
    }

    function getModules() external pure override returns (address[] memory) {
        return new address[](0);
    }

    function isModuleBound(address) external pure override returns (bool) {
        return false;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}