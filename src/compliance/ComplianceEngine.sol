// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IComplianceEngine } from "../interfaces/IComplianceEngine.sol";
import { IIdentityRegistry } from "../interfaces/IIdentityRegistry.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title ComplianceEngine
 * @author Steph Rayan
 * @notice UUPS upgradeable regulatory compliance engine enforcing VARA/DLD rules — v3.0.
 * @custom:security Educational / portfolio project. Internal review only. No external audit.
 *      Not production-ready without a Tier-1 audit, legal opinion and regulated entity.
 * @dev v3 is UUPS upgradeable. Stateful hooks for modular compliance tracking planned for Phase 2.
 */
contract ComplianceEngine is
    IComplianceEngine,
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
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
    event UpgradeAuthorized(address indexed newImplementation, address indexed actor);

    error ComplianceEngine__ZeroAddress();
    error ComplianceEngine__TokenMismatch();
    error ComplianceEngine__NotToken();
    error ComplianceEngine__NotContract(address addr);
    error ComplianceEngine__InvalidCountryCode(uint16 country);

    modifier nonZeroAddress(address addr) {
        if (addr == address(0)) revert ComplianceEngine__ZeroAddress();
        _;
    }

    modifier onlyToken() {
        if (msg.sender != token) revert ComplianceEngine__NotToken();
        _;
    }

    modifier validCountry(uint16 country) {
        if (country == 0 || country > 999) revert ComplianceEngine__InvalidCountryCode(country);
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the compliance engine.
     * @param admin The address to receive the default admin and regulator roles.
     * @param identityRegistryAddr The identity registry contract address.
     */
    function initialize(address admin, address identityRegistryAddr)
        external
        initializer
        nonZeroAddress(admin)
        nonZeroAddress(identityRegistryAddr)
    {
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGULATOR_ROLE, admin);
        identityRegistry = IIdentityRegistry(identityRegistryAddr);
    }

    /// @inheritdoc IComplianceEngine
    function isCompliant(address from, address to, uint256 amount) external view returns (bool) {
        return _checkRules(from, to, amount);
    }

    /// @inheritdoc IComplianceEngine
    function canCreate(address to, uint256 amount) external view returns (bool) {
        return _checkRules(address(0), to, amount);
    }

    /// @inheritdoc IComplianceEngine
    function canDestroy(address from, uint256 amount) external view returns (bool) {
        return _checkRules(from, address(0), amount);
    }

    /**
     * @notice Core compliance logic. No amount bypass — frozen accounts are blocked regardless of amount.
     */
    function _checkRules(
        address from,
        address to,
        uint256 /*amount*/
    )
        internal
        view
        returns (bool)
    {
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

        if (whitelistEnabled) {
            if (from != address(0) && !_whitelisted[from]) return false;
            if (to != address(0) && !_whitelisted[to]) return false;
        }

        return true;
    }

    /// @inheritdoc IComplianceEngine
    function transferred(
        address,
        /*from*/
        address,
        /*to*/
        uint256 /*amount*/
    )
        external
        override
        onlyToken
    {
        // Phase 2: Modular compliance tracking (daily limits, counters, etc.)
        // Only the bound token may call this hook to prevent state manipulation.
    }

    /// @inheritdoc IComplianceEngine
    function created(
        address,
        /*to*/
        uint256 /*amount*/
    )
        external
        override
        onlyToken
    {
        // Phase 2: Modular compliance tracking
        // Only the bound token may call this hook to prevent state manipulation.
    }

    /// @inheritdoc IComplianceEngine
    function destroyed(
        address,
        /*from*/
        uint256 /*amount*/
    )
        external
        override
        onlyToken
    {
        // Phase 2: Modular compliance tracking
        // Only the bound token may call this hook to prevent state manipulation.
    }

    /// @inheritdoc IComplianceEngine
    function freezeInvestor(address investor, string calldata reason) external onlyRole(REGULATOR_ROLE) {
        _frozen[investor] = true;
        emit InvestorFrozen(investor, reason, block.timestamp, msg.sender);
    }

    /// @inheritdoc IComplianceEngine
    function unfreezeInvestor(address investor) external onlyRole(REGULATOR_ROLE) {
        _frozen[investor] = false;
        emit InvestorUnfrozen(investor, block.timestamp, msg.sender);
    }

    /// @inheritdoc IComplianceEngine
    function isFrozen(address investor) external view returns (bool) {
        return _frozen[investor];
    }

    /**
     * @notice Restricts all transfers from/to investors of a given country.
     * @param country The country code to restrict.
     */
    function restrictCountry(uint16 country) external onlyRole(REGULATOR_ROLE) validCountry(country) {
        _restrictedCountries[country] = true;
        emit CountryRestricted(country, block.timestamp, msg.sender);
    }

    /**
     * @notice Removes a country restriction.
     * @param country The country code to unrestrict.
     */
    function unrestrictCountry(uint16 country) external onlyRole(REGULATOR_ROLE) validCountry(country) {
        _restrictedCountries[country] = false;
        emit CountryUnrestricted(country, block.timestamp, msg.sender);
    }

    /**
     * @notice Returns whether a country is currently restricted.
     * @param country The country code to check.
     * @return True if restricted, false otherwise.
     */
    function isCountryRestricted(uint16 country) external view returns (bool) {
        return _restrictedCountries[country];
    }

    /**
     * @notice Enables or disables the whitelist mode.
     * @param enabled True to enable whitelist, false to disable.
     */
    function setWhitelistEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistEnabled = enabled;
        emit WhitelistEnabled(enabled, block.timestamp, msg.sender);
    }

    /**
     * @notice Adds or removes an account from the whitelist.
     * @param account The account address.
     * @param status True to whitelist, false to remove.
     */
    function setWhitelisted(address account, bool status) external onlyRole(REGULATOR_ROLE) {
        _whitelisted[account] = status;
        emit WhitelistUpdated(account, status, msg.sender);
    }

    /**
     * @notice Returns whether an account is whitelisted.
     * @param account The account address.
     * @return True if whitelisted, false otherwise.
     */
    function isWhitelisted(address account) external view returns (bool) {
        return _whitelisted[account];
    }

    /**
     * @notice Sets the identity registry contract.
     * @param registry The identity registry address.
     */
    function setIdentityRegistry(address registry) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(registry) {
        if (registry.code.length == 0) revert ComplianceEngine__NotContract(registry);
        identityRegistry = IIdentityRegistry(registry);
        emit IdentityRegistrySet(registry);
    }

    /// @inheritdoc IComplianceEngine
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

    /// @inheritdoc IComplianceEngine
    function addModule(address module) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ModuleAdded(module);
    }

    /// @inheritdoc IComplianceEngine
    function removeModule(address module) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        emit ModuleRemoved(module);
    }

    /// @inheritdoc IComplianceEngine
    function getModules() external pure override returns (address[] memory) {
        return new address[](0);
    }

    /// @inheritdoc IComplianceEngine
    function isModuleBound(address) external pure override returns (bool) {
        return false;
    }

    /**
     * @notice Pauses compliance checks and transfers.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Resumes compliance checks and transfers.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {
        // Upgrade authorization restricted to admin (TimelockController in production).
        if (newImplementation.code.length == 0) revert ComplianceEngine__NotContract(newImplementation);
        emit UpgradeAuthorized(newImplementation, msg.sender);
    }

    /**
     * @dev Reserved storage slots for future upgrades.
     *      Do NOT remove or modify. New variables must be added above this gap.
     */
    uint256[50] private __gap;
}
