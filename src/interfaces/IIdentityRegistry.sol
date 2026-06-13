// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IIdentityRegistry
 * @author Steph Rayan
 * @notice Interface for the on-chain identity registry compliant with ERC-3643 (T-REX).
 * @custom:security Restrict sensitive functions to authorized issuers or governance timelocks.
 * @custom:standard ERC-3643 (T-REX) v4.x
 */
interface IIdentityRegistry {
    enum InvestorType {
        Retail,
        Accredited,
        Qualified,
        Institutional
    }

    enum VerificationStatus {
        Unverified,
        Verified,
        Expired,
        Revoked
    }

    error IIdentityRegistry__ZeroAddress();
    error IIdentityRegistry__IdentityAlreadyExists(address investor);
    error IIdentityRegistry__IdentityNotRegistered(address investor);
    error IIdentityRegistry__InvalidIdentity(address identity);
    error IIdentityRegistry__InvalidCountryCode(uint16 country);
    error IIdentityRegistry__ArrayLengthMismatch();
    error IIdentityRegistry__EmptyBatch();
    error IIdentityRegistry__BatchSizeExceeded(uint256 size);
    error IIdentityRegistry__NotAuthorizedIssuer(address issuer);
    error IIdentityRegistry__KYCExpired(address investor);
    error IIdentityRegistry__KYCExpiryTooSoon(uint256 expiry);
    error IIdentityRegistry__IdentityHasBalance(address investor);
    error IIdentityRegistry__IdentityHasPendingDividends(address investor);
    error IIdentityRegistry__TokenNotSet();
    error IIdentityRegistry__IdentityContractAlreadyAssigned(address identity, address existingInvestor);

    event IdentityRegistered(address indexed investor, address indexed identity);
    event IdentityRemoved(address indexed investor, address indexed identity);
    event IdentityUpdated(address indexed investor, address indexed oldIdentity, address indexed newIdentity);
    event CountryUpdated(address indexed investor, uint16 indexed country);
    event InvestorTypeUpdated(address indexed investor, InvestorType indexed investorType);
    event KYCExpiryUpdated(address indexed investor, uint256 expiry);

    event TrustedIssuerAdded(address indexed trustedIssuer, uint256[] claimTopics, address indexed actor);
    event TrustedIssuerRemoved(address indexed trustedIssuer, address indexed actor);
    event TrustedIssuerClaimTopicsUpdated(address indexed trustedIssuer, uint256[] claimTopics, address indexed actor);

    event TokenSet(address indexed oldToken, address indexed newToken);
    event IdentityRegistryStorageSet(address indexed storage_);
    event ClaimTopicsRegistrySet(address indexed registry);
    event TrustedIssuersRegistrySet(address indexed registry);

    function identity(address investor) external view returns (address identityContract);
    function isVerified(address investor) external view returns (bool);
    function investorCountry(address investor) external view returns (uint16 country);
    function contains(address investor) external view returns (bool);
    function investorCount() external view returns (uint256);
    function investorType(address investor) external view returns (InvestorType);
    function isVerifiedWithDetails(address investor)
        external
        view
        returns (VerificationStatus status, InvestorType invType);
    function kycExpiry(address investor) external view returns (uint256 expiry);
    function updateKYCExpiry(address investor, uint256 expiry) external;

    function setIdentityRegistryStorage(address identityRegistryStorage) external;
    function getIdentityRegistryStorage() external view returns (address);
    function setClaimTopicsRegistry(address claimTopicsRegistry) external;
    function getClaimTopicsRegistry() external view returns (address);
    function setTrustedIssuersRegistry(address trustedIssuersRegistry) external;
    function getTrustedIssuersRegistry() external view returns (address);

    function addTrustedIssuer(address trustedIssuer, uint256[] calldata claimTopics) external;
    function removeTrustedIssuer(address trustedIssuer) external;
    function updateTrustedIssuerClaimTopics(address trustedIssuer, uint256[] calldata claimTopics) external;
    function getTrustedIssuers() external view returns (address[] memory);
    function isTrustedIssuer(address trustedIssuer) external view returns (bool);
    function getTrustedIssuerClaimTopics(address trustedIssuer) external view returns (uint256[] memory);

    function registerIdentity(address investor, address identity, uint16 country) external;
    function registerIdentity(
        address investor,
        address identity,
        uint16 country,
        InvestorType investorType_,
        uint256 kycExpiry_
    ) external;
    function updateCountry(address investor, uint16 country) external;
    function updateIdentity(address investor, address identity) external;
    function updateInvestorType(address investor, InvestorType investorType) external;
    function deleteIdentity(address investor) external;

    function batchRegisterIdentity(
        address[] calldata investors,
        address[] calldata identities,
        uint16[] calldata countries
    ) external;
}
