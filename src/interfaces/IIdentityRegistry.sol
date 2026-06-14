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

    /**
     * @notice Returns the identity contract address associated with an investor.
     * @param investor The investor address.
     * @return identityContract The bound identity contract address.
     */
    function identity(address investor) external view returns (address identityContract);

    /**
     * @notice Returns whether an investor is verified and KYC is not expired.
     * @param investor The investor address.
     * @return True if verified, false otherwise.
     */
    function isVerified(address investor) external view returns (bool);

    /**
     * @notice Returns the country code associated with an investor.
     * @param investor The investor address.
     * @return country The ISO country code.
     */
    function investorCountry(address investor) external view returns (uint16 country);

    /**
     * @notice Returns whether an investor has a registered identity.
     * @param investor The investor address.
     * @return True if registered, false otherwise.
     */
    function contains(address investor) external view returns (bool);

    /**
     * @notice Returns the total number of registered investors.
     * @return The investor count.
     */
    function investorCount() external view returns (uint256);

    /**
     * @notice Returns the investor type of a registered investor.
     * @param investor The investor address.
     * @return The investor type.
     */
    function investorType(address investor) external view returns (InvestorType);

    /**
     * @notice Returns detailed verification status and investor type.
     * @param investor The investor address.
     * @return status The current verification status.
     * @return invType The investor type.
     */
    function isVerifiedWithDetails(address investor)
        external
        view
        returns (VerificationStatus status, InvestorType invType);

    /**
     * @notice Returns the KYC expiry timestamp for an investor.
     * @param investor The investor address.
     * @return expiry The expiry timestamp.
     */
    function kycExpiry(address investor) external view returns (uint256 expiry);

    /**
     * @notice Updates the KYC expiry timestamp for an investor.
     * @param investor The investor address.
     * @param expiry The new expiry timestamp.
     */
    function updateKYCExpiry(address investor, uint256 expiry) external;

    /**
     * @notice Sets the identity registry storage contract.
     * @param identityRegistryStorage The storage contract address.
     */
    function setIdentityRegistryStorage(address identityRegistryStorage) external;

    /**
     * @notice Returns the identity registry storage contract address.
     * @return The storage contract address.
     */
    function getIdentityRegistryStorage() external view returns (address);

    /**
     * @notice Sets the claim topics registry contract.
     * @param claimTopicsRegistry The claim topics registry address.
     */
    function setClaimTopicsRegistry(address claimTopicsRegistry) external;

    /**
     * @notice Returns the claim topics registry contract address.
     * @return The claim topics registry address.
     */
    function getClaimTopicsRegistry() external view returns (address);

    /**
     * @notice Sets the trusted issuers registry contract.
     * @param trustedIssuersRegistry The trusted issuers registry address.
     */
    function setTrustedIssuersRegistry(address trustedIssuersRegistry) external;

    /**
     * @notice Returns the trusted issuers registry contract address.
     * @return The trusted issuers registry address.
     */
    function getTrustedIssuersRegistry() external view returns (address);

    /**
     * @notice Adds a trusted issuer and its claim topics.
     * @param trustedIssuer The issuer address.
     * @param claimTopics The claim topics the issuer is trusted for.
     */
    function addTrustedIssuer(address trustedIssuer, uint256[] calldata claimTopics) external;

    /**
     * @notice Removes a trusted issuer.
     * @param trustedIssuer The issuer address to remove.
     */
    function removeTrustedIssuer(address trustedIssuer) external;

    /**
     * @notice Updates the claim topics of a trusted issuer.
     * @param trustedIssuer The issuer address.
     * @param claimTopics The new claim topics.
     */
    function updateTrustedIssuerClaimTopics(address trustedIssuer, uint256[] calldata claimTopics) external;

    /**
     * @notice Returns the list of trusted issuers.
     * @return An array of trusted issuer addresses.
     */
    function getTrustedIssuers() external view returns (address[] memory);

    /**
     * @notice Returns whether an address is a trusted issuer.
     * @param trustedIssuer The address to check.
     * @return True if trusted, false otherwise.
     */
    function isTrustedIssuer(address trustedIssuer) external view returns (bool);

    /**
     * @notice Returns the claim topics associated with a trusted issuer.
     * @param trustedIssuer The issuer address.
     * @return An array of claim topics.
     */
    function getTrustedIssuerClaimTopics(address trustedIssuer) external view returns (uint256[] memory);

    /**
     * @notice Registers a new investor identity with country only.
     * @param investor The investor address.
     * @param identity The identity contract address.
     * @param country The investor country code.
     */
    function registerIdentity(address investor, address identity, uint16 country) external;

    /**
     * @notice Registers a new investor identity with full details.
     * @param investor The investor address.
     * @param identity The identity contract address.
     * @param country The investor country code.
     * @param investorType_ The investor type.
     * @param kycExpiry_ The KYC expiry timestamp.
     */
    function registerIdentity(
        address investor,
        address identity,
        uint16 country,
        InvestorType investorType_,
        uint256 kycExpiry_
    ) external;

    /**
     * @notice Updates the country of a registered investor.
     * @param investor The investor address.
     * @param country The new country code.
     */
    function updateCountry(address investor, uint16 country) external;

    /**
     * @notice Updates the identity contract of a registered investor.
     * @param investor The investor address.
     * @param identity The new identity contract address.
     */
    function updateIdentity(address investor, address identity) external;

    /**
     * @notice Updates the investor type of a registered investor.
     * @param investor The investor address.
     * @param investorType The new investor type.
     */
    function updateInvestorType(address investor, InvestorType investorType) external;

    /**
     * @notice Deletes the identity of a registered investor.
     * @param investor The investor address to remove.
     */
    function deleteIdentity(address investor) external;

    /**
     * @notice Registers multiple investors in a single transaction.
     * @param investors Array of investor addresses.
     * @param identities Array of identity contract addresses.
     * @param countries Array of country codes.
     */
    function batchRegisterIdentity(
        address[] calldata investors,
        address[] calldata identities,
        uint16[] calldata countries
    ) external;
}
