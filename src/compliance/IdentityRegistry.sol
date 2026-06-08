// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IIdentityRegistry} from "../interfaces/IIdentityRegistry.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IdentityRegistry
 * @author Steph Rayan
 * @notice Production implementation of the ERC-3643 compliant identity registry — v2.1.
 * @custom:security Internal review only. Not production-ready without external audit.
 * @custom:standard ERC-3643 (T-REX) v4.x — Phase 1 compliant.
 */
contract IdentityRegistry is IIdentityRegistry, AccessControl, Pausable {

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    mapping(address => address) private _identities;
    mapping(address => uint16) private _investorCountries;
    mapping(address => InvestorType) private _investorTypes;
    mapping(address => uint256) private _kycExpiries;
    uint256 private _investorCount;

    address private _identityStorage;
    address private _claimTopicsRegistry;
    address private _trustedIssuersRegistry;

    address public token;

    address[] private _trustedIssuers;
    mapping(address => bool) private _isTrustedIssuer;
    mapping(address => uint256[]) private _trustedIssuerClaimTopics;
    mapping(address => uint256) private _trustedIssuerIndex;

    modifier nonZeroAddress(address addr) {
        if (addr == address(0)) {
            revert IIdentityRegistry__ZeroAddress();
        }
        _;
    }

    modifier validCountry(uint16 country) {
        if (country == 0 || country > 999) {
            revert IIdentityRegistry__InvalidCountryCode(country);
        }
        _;
    }

    modifier isContract(address addr) {
        if (addr.code.length == 0) {
            revert IIdentityRegistry__InvalidIdentity(addr);
        }
        _;
    }

    constructor(address admin) nonZeroAddress(admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    function identity(address investor) external view returns (address identityContract) {
        return _identities[investor];
    }

    function isVerified(address investor) external view returns (bool) {
        address id = _identities[investor];
        if (id == address(0)) return false;
        if (id.code.length == 0) return false;
        if (block.timestamp > _kycExpiries[investor]) return false;
        return true;
    }

    function investorCountry(address investor) external view returns (uint16 country) {
        return _investorCountries[investor];
    }

    function contains(address investor) external view returns (bool) {
        return _identities[investor] != address(0);
    }

    function investorCount() external view returns (uint256) {
        return _investorCount;
    }

    function investorType(address investor) external view returns (InvestorType) {
        return _investorTypes[investor];
    }

    function isVerifiedWithDetails(address investor)
        external
        view
        returns (VerificationStatus status, InvestorType invType)
    {
        address id = _identities[investor];
        invType = _investorTypes[investor];

        if (id == address(0)) {
            status = VerificationStatus.Unverified;
        } else if (id.code.length == 0) {
            status = VerificationStatus.Revoked;
        } else if (block.timestamp > _kycExpiries[investor]) {
            status = VerificationStatus.Expired;
        } else {
            status = VerificationStatus.Verified;
        }
    }

    function kycExpiry(address investor) external view returns (uint256 expiry) {
        return _kycExpiries[investor];
    }

    function setToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(_token) {
        if (_token.code.length == 0) revert IIdentityRegistry__InvalidIdentity(_token);
        token = _token;
    }

    function setIdentityRegistryStorage(address identityRegistryStorage)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonZeroAddress(identityRegistryStorage)
    {
        _identityStorage = identityRegistryStorage;
        emit IdentityRegistryStorageSet(identityRegistryStorage);
    }

    function getIdentityRegistryStorage() external view returns (address) {
        return _identityStorage;
    }

    function setClaimTopicsRegistry(address claimTopicsRegistry)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonZeroAddress(claimTopicsRegistry)
    {
        _claimTopicsRegistry = claimTopicsRegistry;
        emit ClaimTopicsRegistrySet(claimTopicsRegistry);
    }

    function getClaimTopicsRegistry() external view returns (address) {
        return _claimTopicsRegistry;
    }

    function setTrustedIssuersRegistry(address trustedIssuersRegistry)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonZeroAddress(trustedIssuersRegistry)
    {
        _trustedIssuersRegistry = trustedIssuersRegistry;
        emit TrustedIssuersRegistrySet(trustedIssuersRegistry);
    }

    function getTrustedIssuersRegistry() external view returns (address) {
        return _trustedIssuersRegistry;
    }

    function addTrustedIssuer(address trustedIssuer, uint256[] calldata claimTopics)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonZeroAddress(trustedIssuer)
    {
        if (_isTrustedIssuer[trustedIssuer]) {
            revert IIdentityRegistry__IdentityAlreadyExists(trustedIssuer);
        }
        if (claimTopics.length == 0) {
            revert IIdentityRegistry__ArrayLengthMismatch();
        }

        _trustedIssuerIndex[trustedIssuer] = _trustedIssuers.length;
        _trustedIssuers.push(trustedIssuer);
        _isTrustedIssuer[trustedIssuer] = true;
        _trustedIssuerClaimTopics[trustedIssuer] = claimTopics;

        emit TrustedIssuerAdded(trustedIssuer, claimTopics, msg.sender);
    }

    function removeTrustedIssuer(address trustedIssuer)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (!_isTrustedIssuer[trustedIssuer]) {
            revert IIdentityRegistry__NotAuthorizedIssuer(trustedIssuer);
        }

        uint256 index = _trustedIssuerIndex[trustedIssuer];
        uint256 lastIndex = _trustedIssuers.length - 1;

        if (index != lastIndex) {
            address lastIssuer = _trustedIssuers[lastIndex];
            _trustedIssuers[index] = lastIssuer;
            _trustedIssuerIndex[lastIssuer] = index;
        }

        _trustedIssuers.pop();
        delete _isTrustedIssuer[trustedIssuer];
        delete _trustedIssuerClaimTopics[trustedIssuer];
        delete _trustedIssuerIndex[trustedIssuer];

        emit TrustedIssuerRemoved(trustedIssuer, msg.sender);
    }

    function updateTrustedIssuerClaimTopics(
        address trustedIssuer,
        uint256[] calldata claimTopics
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_isTrustedIssuer[trustedIssuer]) {
            revert IIdentityRegistry__NotAuthorizedIssuer(trustedIssuer);
        }
        if (claimTopics.length == 0) {
            revert IIdentityRegistry__ArrayLengthMismatch();
        }

        _trustedIssuerClaimTopics[trustedIssuer] = claimTopics;
        emit TrustedIssuerClaimTopicsUpdated(trustedIssuer, claimTopics, msg.sender);
    }

    function getTrustedIssuers() external view returns (address[] memory) {
        return _trustedIssuers;
    }

    function isTrustedIssuer(address trustedIssuer) external view returns (bool) {
        return _isTrustedIssuer[trustedIssuer];
    }

    function getTrustedIssuerClaimTopics(address trustedIssuer)
        external
        view
        returns (uint256[] memory)
    {
        return _trustedIssuerClaimTopics[trustedIssuer];
    }

    function registerIdentity(
        address investor,
        address identityAddr,
        uint16 country
    )
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonZeroAddress(investor)
        nonZeroAddress(identityAddr)
        isContract(identityAddr)
        validCountry(country)
    {
        if (_identities[investor] != address(0)) {
            revert IIdentityRegistry__IdentityAlreadyExists(investor);
        }

        _identities[investor] = identityAddr;
        _investorCountries[investor] = country;
        _investorTypes[investor] = InvestorType.Retail;
        _kycExpiries[investor] = block.timestamp + 365 days;
        _investorCount++;

        emit IdentityRegistered(investor, identityAddr);
        emit InvestorTypeUpdated(investor, InvestorType.Retail);
    }

    function registerIdentity(
        address investor,
        address identityAddr,
        uint16 country,
        InvestorType investorType_,
        uint256 kycExpiry_
    )
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonZeroAddress(investor)
        nonZeroAddress(identityAddr)
        isContract(identityAddr)
        validCountry(country)
    {
        if (_identities[investor] != address(0)) {
            revert IIdentityRegistry__IdentityAlreadyExists(investor);
        }
        if (kycExpiry_ <= block.timestamp) {
            revert IIdentityRegistry__KYCExpired(investor);
        }

        _identities[investor] = identityAddr;
        _investorCountries[investor] = country;
        _investorTypes[investor] = investorType_;
        _kycExpiries[investor] = kycExpiry_;
        _investorCount++;

        emit IdentityRegistered(investor, identityAddr);
        emit InvestorTypeUpdated(investor, investorType_);
    }

    function updateCountry(address investor, uint16 country)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        validCountry(country)
    {
        if (_identities[investor] == address(0)) {
            revert IIdentityRegistry__IdentityNotRegistered(investor);
        }

        _investorCountries[investor] = country;
        emit CountryUpdated(investor, country);
    }

    function updateIdentity(address investor, address identityAddr)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonZeroAddress(investor)
        nonZeroAddress(identityAddr)
        isContract(identityAddr)
    {
        address oldIdentity = _identities[investor];
        if (oldIdentity == address(0)) {
            revert IIdentityRegistry__IdentityNotRegistered(investor);
        }

        _identities[investor] = identityAddr;
        emit IdentityUpdated(investor, oldIdentity, identityAddr);
    }

    function updateInvestorType(address investor, InvestorType invType)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        if (_identities[investor] == address(0)) {
            revert IIdentityRegistry__IdentityNotRegistered(investor);
        }

        _investorTypes[investor] = invType;
        emit InvestorTypeUpdated(investor, invType);
    }

    function updateKYCExpiry(address investor, uint256 expiry)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        if (_identities[investor] == address(0)) {
            revert IIdentityRegistry__IdentityNotRegistered(investor);
        }
        if (expiry <= block.timestamp + 1 days) {
            revert IIdentityRegistry__KYCExpiryTooSoon(expiry);
        }

        _kycExpiries[investor] = expiry;
        emit KYCExpiryUpdated(investor, expiry);
    }

    function deleteIdentity(address investor)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        address identityAddr = _identities[investor];
        if (identityAddr == address(0)) {
            revert IIdentityRegistry__IdentityNotRegistered(investor);
        }
        if (token != address(0) && IERC20(token).balanceOf(investor) > 0) {
            revert IIdentityRegistry__IdentityHasBalance(investor);
        }

        delete _identities[investor];
        delete _investorCountries[investor];
        delete _investorTypes[investor];
        delete _kycExpiries[investor];
        _investorCount--;

        emit IdentityRemoved(investor, identityAddr);
    }

    function batchRegisterIdentity(
        address[] calldata investors,
        address[] calldata identities,
        uint16[] calldata countries
    ) external onlyRole(ISSUER_ROLE) whenNotPaused {
        uint256 length = investors.length;
        if (length == 0 || length != identities.length || length != countries.length) {
            revert IIdentityRegistry__ArrayLengthMismatch();
        }
        if (length > 200) {
            revert IIdentityRegistry__BatchSizeExceeded(length);
        }

        for (uint256 i; i < length; ++i) {
            address investor = investors[i];
            address identityAddr = identities[i];
            uint16 country = countries[i];

            if (investor == address(0) || identityAddr == address(0)) {
                revert IIdentityRegistry__ZeroAddress();
            }
            if (identityAddr.code.length == 0) {
                revert IIdentityRegistry__InvalidIdentity(identityAddr);
            }
            if (country == 0 || country > 999) {
                revert IIdentityRegistry__InvalidCountryCode(country);
            }
            if (_identities[investor] != address(0)) {
                revert IIdentityRegistry__IdentityAlreadyExists(investor);
            }

            _identities[investor] = identityAddr;
            _investorCountries[investor] = country;
            _investorTypes[investor] = InvestorType.Retail;
            _kycExpiries[investor] = block.timestamp + 365 days;
            _investorCount++;

            emit IdentityRegistered(investor, identityAddr);
            emit InvestorTypeUpdated(investor, InvestorType.Retail);
        }
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}