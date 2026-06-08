// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../../src/compliance/IdentityRegistry.sol";
import "../../src/interfaces/IIdentityRegistry.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MockIdentity
 * @notice Dummy identity contract to pass the extcodesize > 0 check.
 * In production this would be an ONCHAINID ERC-734/735 contract.
 */
contract MockIdentity {
    // Intentionally empty. Its existence at an address is sufficient.
}

/**
 * @title IdentityRegistryTest
 * @notice Unit tests for the KYC/AML identity registry.
 * @dev Real-world analogy: A notary verifies investor passports before
 *      they are allowed to buy tokenized real estate.
 */
contract IdentityRegistryTest is Test {

    // ============================================
    // CONTRACTS UNDER TEST
    // ============================================
    IdentityRegistry public registry;
    MockIdentity public mockIdentity;

    // ============================================
    // ACTORS (dummy addresses)
    // ============================================
    address public admin;   // Project owner / chief notary
    address public issuer;  // Authorized KYC officer
    address public karim;   // Investor: Karim, UAE
    address public bob;     // Investor: Bob, France
    address public hacker;  // Malicious attacker

    // ============================================
    // CONSTANTS
    // ============================================
    uint16 constant COUNTRY_UAE = 784;
    uint16 constant COUNTRY_FRANCE = 250;
    uint16 constant COUNTRY_INVALID = 0;

    // ============================================
    // EVENTS (redeclared for vm.expectEmit)
    // ============================================
    event IdentityRegistered(address indexed investor, address indexed identity);
    event IdentityRemoved(address indexed investor, address indexed identity);
    event IdentityUpdated(address indexed investor, address indexed oldIdentity, address indexed newIdentity);
    event CountryUpdated(address indexed investor, uint16 indexed country);
    event KYCExpiryUpdated(address indexed investor, uint256 expiry);
    event TrustedIssuerAdded(address indexed trustedIssuer, uint256[] claimTopics, address indexed actor);
    event TrustedIssuerRemoved(address indexed trustedIssuer, address indexed actor);
    event TrustedIssuerClaimTopicsUpdated(address indexed trustedIssuer, uint256[] claimTopics, address indexed actor);
    event IdentityRegistryStorageSet(address indexed identityRegistryStorage);
    event ClaimTopicsRegistrySet(address indexed claimTopicsRegistry);
    event TrustedIssuersRegistrySet(address indexed trustedIssuersRegistry);

    // ============================================
    // SETUP: Foundry runs this before EVERY test
    // ============================================
    function setUp() public {
        admin  = makeAddr("admin");
        issuer = makeAddr("issuer");
        karim  = makeAddr("karim");
        bob    = makeAddr("bob");
        hacker = makeAddr("hacker");

        vm.startPrank(admin);
        registry = new IdentityRegistry(admin);
        registry.grantRole(registry.ISSUER_ROLE(), issuer);
        vm.stopPrank();

        mockIdentity = new MockIdentity();
    }

    // ============================================
    // TEST 0: DEPLOYMENT — Zero address admin reverts
    // ============================================
    function test_Constructor_ZeroAddressAdmin() public {
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        new IdentityRegistry(address(0));
    }

    // ============================================
    // TEST 1: DEPLOYMENT — Are roles assigned correctly?
    // ============================================
    function test_DeploymentRoles() public view {
        assertTrue(
            registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), admin),
            "Admin must hold DEFAULT_ADMIN_ROLE"
        );
        assertTrue(
            registry.hasRole(registry.ISSUER_ROLE(), admin),
            "Admin must hold ISSUER_ROLE"
        );
        assertTrue(
            registry.hasRole(registry.ISSUER_ROLE(), issuer),
            "Issuer must hold ISSUER_ROLE"
        );
    }

    // ============================================
    // TEST 2: HAPPY PATH — Karim passes KYC
    // ============================================
    function test_RegisterIdentity_Success() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        assertTrue(registry.isVerified(karim), "Karim must be verified");
        assertEq(registry.identity(karim), address(mockIdentity), "Identity must be stored");
        assertEq(registry.investorCountry(karim), COUNTRY_UAE, "Country must be UAE (784)");
        assertTrue(registry.contains(karim), "Karim must be in registry");
        assertEq(registry.investorCount(), 1, "Investor count must be 1");
    }

    // ============================================
    // TEST 3: EVENT — IdentityRegistered emitted
    // ============================================
    function test_RegisterIdentity_EmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit IdentityRegistered(karim, address(mockIdentity));

        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
    }

    // ============================================
    // TEST 4: SECURITY — Hacker cannot register
    // ============================================
    function test_RegisterIdentity_NotIssuerRole() public {
        bytes32 issuerRole = registry.ISSUER_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                issuerRole
            )
        );

        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
    }

    // ============================================
    // TEST 5: INPUT VALIDATION — Zero address investor rejected
    // ============================================
    function test_RegisterIdentity_ZeroAddressInvestor() public {
        vm.prank(issuer);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.registerIdentity(address(0), address(mockIdentity), COUNTRY_UAE);
    }

    // ============================================
    // TEST 6: INPUT VALIDATION — Zero address identity rejected
    // ============================================
    function test_RegisterIdentity_ZeroAddressIdentity() public {
        vm.prank(issuer);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.registerIdentity(karim, address(0), COUNTRY_UAE);
    }

    // ============================================
    // TEST 7: INPUT VALIDATION — Invalid country code rejected
    // ============================================
    function test_RegisterIdentity_InvalidCountry() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidCountryCode.selector,
                COUNTRY_INVALID
            )
        );
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_INVALID);
    }

    // ============================================
    // TEST 8: INPUT VALIDATION — EOA rejected as identity contract
    // ============================================
    function test_RegisterIdentity_EOARejected() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidIdentity.selector,
                bob
            )
        );
        registry.registerIdentity(karim, bob, COUNTRY_UAE);
    }

    // ============================================
    // TEST 9: STATE — Double registration rejected
    // ============================================
    function test_RegisterIdentity_AlreadyExists() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityAlreadyExists.selector,
                karim
            )
        );
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
    }

    // ============================================
    // TEST 10: STATE — Unregistered investor is not verified
    // ============================================
    function test_IsVerified_NotRegistered() public view {
        assertFalse(registry.isVerified(karim), "Unregistered = not verified");
        assertFalse(registry.contains(karim), "Unregistered = not in registry");
    }

    // ============================================
    // TEST 11: STATE — After deletion, investor is no longer verified
    // ============================================
    function test_IsVerified_AfterDelete() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
        assertTrue(registry.isVerified(karim));

        vm.prank(issuer);
        registry.deleteIdentity(karim);

        assertFalse(registry.isVerified(karim), "After delete = not verified");
        assertFalse(registry.contains(karim), "After delete = not in registry");
        assertEq(registry.investorCount(), 0, "Count must be 0");
    }

    // ============================================
    // TEST 12: EVENT — IdentityRemoved emitted
    // ============================================
    function test_DeleteIdentity_EmitsEvent() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.expectEmit(true, true, false, false);
        emit IdentityRemoved(karim, address(mockIdentity));

        vm.prank(issuer);
        registry.deleteIdentity(karim);
    }

    // ============================================
    // TEST 13: STATE — Update identity works
    // ============================================
    function test_UpdateIdentity() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        MockIdentity newIdentity = new MockIdentity();

        vm.prank(issuer);
        registry.updateIdentity(karim, address(newIdentity));

        assertEq(registry.identity(karim), address(newIdentity), "Identity must be updated");
        assertEq(registry.investorCount(), 1, "Count must remain unchanged");
    }

    // ============================================
    // TEST 14: EVENT — IdentityUpdated emitted
    // ============================================
    function test_UpdateIdentity_EmitsEvent() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        MockIdentity newIdentity = new MockIdentity();

        vm.expectEmit(true, true, true, false);
        emit IdentityUpdated(karim, address(mockIdentity), address(newIdentity));

        vm.prank(issuer);
        registry.updateIdentity(karim, address(newIdentity));
    }

    // ============================================
    // TEST 15: STATE — Update country works
    // ============================================
    function test_UpdateCountry() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        registry.updateCountry(karim, COUNTRY_FRANCE);

        assertEq(registry.investorCountry(karim), COUNTRY_FRANCE, "Country must be updated");
    }

    // ============================================
    // TEST 16: EVENT — CountryUpdated emitted
    // ============================================
    function test_UpdateCountry_EmitsEvent() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.expectEmit(true, true, false, false);
        emit CountryUpdated(karim, COUNTRY_FRANCE);

        vm.prank(issuer);
        registry.updateCountry(karim, COUNTRY_FRANCE);
    }

    // ============================================
    // TEST 17: KYC EXPIRY — After expiry, investor is no longer verified
    // ============================================
    function test_KYCExpired() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        uint256 expiryDate = block.timestamp + 30 days;
        vm.prank(issuer);
        registry.updateKYCExpiry(karim, expiryDate);

        assertTrue(registry.isVerified(karim), "Before expiry = verified");

        vm.warp(block.timestamp + 31 days);
        assertFalse(registry.isVerified(karim), "After expiry = not verified");
    }

    // ============================================
    // TEST 18: EVENT — KYCExpiryUpdated emitted
    // ============================================
    function test_UpdateKYCExpiry_EmitsEvent() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        uint256 expiryDate = block.timestamp + 365 days;

        vm.expectEmit(true, false, false, true);
        emit KYCExpiryUpdated(karim, expiryDate);

        vm.prank(issuer);
        registry.updateKYCExpiry(karim, expiryDate);
    }

    // ============================================
    // TEST 18b: updateKYCExpiry — expiry too soon reverts
    // ============================================
    function test_UpdateKYCExpiry_TooSoon() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        uint256 badExpiry = block.timestamp + 1 hours; // less than 1 day

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__KYCExpiryTooSoon.selector,
                badExpiry
            )
        );
        registry.updateKYCExpiry(karim, badExpiry);
    }

    // ============================================
    // TEST 19: PAUSABLE — When regulator freezes the registry
    // ============================================
    function test_Pause_BlocksRegistration() public {
        vm.prank(admin);
        registry.pause();

        assertTrue(registry.paused(), "Must be paused");

        vm.prank(issuer);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
    }

    // ============================================
    // TEST 20: PAUSABLE — Non-admin cannot pause
    // ============================================
    function test_Pause_ByNonAdmin_Reverts() public {
        bytes32 adminRole = registry.DEFAULT_ADMIN_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        registry.pause();
    }

    // ============================================
    // TEST 21: PAUSABLE — Unpause restores functionality
    // ============================================
    function test_Unpause_AllowsRegistration() public {
        vm.prank(admin);
        registry.pause();

        vm.prank(admin);
        registry.unpause();

        assertFalse(registry.paused(), "Must not be paused");

        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        assertTrue(registry.isVerified(karim), "Registration must succeed after unpause");
    }

    // ============================================
    // TEST 22: TRUSTED ISSUER — Add and remove
    // ============================================
    function test_TrustedIssuer_AddRemove() public {
        address issuer1 = makeAddr("issuer1");
        address issuer2 = makeAddr("issuer2");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        vm.prank(admin);
        registry.addTrustedIssuer(issuer2, topics);

        assertTrue(registry.isTrustedIssuer(issuer1), "Issuer1 must be trusted");
        assertTrue(registry.isTrustedIssuer(issuer2), "Issuer2 must be trusted");
        assertEq(registry.getTrustedIssuers().length, 2, "Must have 2 issuers");

        vm.prank(admin);
        registry.removeTrustedIssuer(issuer1);

        assertFalse(registry.isTrustedIssuer(issuer1), "Issuer1 must be removed");
        assertTrue(registry.isTrustedIssuer(issuer2), "Issuer2 must remain");
        assertEq(registry.getTrustedIssuers().length, 1, "Must have 1 issuer");
    }

    // ============================================
    // TEST 23: EVENT — TrustedIssuerAdded emitted
    // ============================================
    function test_AddTrustedIssuer_EmitsEvent() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.expectEmit(true, false, true, false);
        emit TrustedIssuerAdded(issuer1, topics, admin);

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);
    }

    // ============================================
    // TEST 24: EVENT — TrustedIssuerRemoved emitted
    // ============================================
    function test_RemoveTrustedIssuer_EmitsEvent() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        vm.expectEmit(true, true, false, false);
        emit TrustedIssuerRemoved(issuer1, admin);

        vm.prank(admin);
        registry.removeTrustedIssuer(issuer1);
    }

    // ============================================
    // TEST 25: BATCH — Register multiple investors at once
    // ============================================
    function test_BatchRegisterIdentity() public {
        address ali  = makeAddr("ali");
        address omar = makeAddr("omar");
        address sara = makeAddr("sara");

        MockIdentity id2 = new MockIdentity();
        MockIdentity id3 = new MockIdentity();

        address[] memory investors = new address[](3);
        investors[0] = ali;
        investors[1] = omar;
        investors[2] = sara;

        address[] memory identities = new address[](3);
        identities[0] = address(mockIdentity);
        identities[1] = address(id2);
        identities[2] = address(id3);

        uint16[] memory countries = new uint16[](3);
        countries[0] = COUNTRY_UAE;
        countries[1] = COUNTRY_UAE;
        countries[2] = COUNTRY_FRANCE;

        vm.prank(issuer);
        registry.batchRegisterIdentity(investors, identities, countries);

        assertTrue(registry.isVerified(ali), "Ali must be verified");
        assertTrue(registry.isVerified(omar), "Omar must be verified");
        assertTrue(registry.isVerified(sara), "Sara must be verified");
        assertEq(registry.investorCount(), 3, "3 investors registered");

        // Deep verification per investor
        assertEq(registry.identity(ali), address(mockIdentity), "Ali identity correct");
        assertEq(registry.identity(sara), address(id3), "Sara identity correct");
        assertEq(registry.investorCountry(sara), COUNTRY_FRANCE, "Sara country correct");
        assertEq(uint256(registry.investorType(ali)), uint256(IIdentityRegistry.InvestorType.Retail), "Ali type = Retail");
    }

    // ============================================
    // TEST 26: BATCH — Array length mismatch reverts
    // ============================================
    function test_BatchRegisterIdentity_ArrayMismatch() public {
        address[] memory investors = new address[](2);
        investors[0] = karim;
        investors[1] = bob;

        address[] memory identities = new address[](1);
        identities[0] = address(mockIdentity);

        uint16[] memory countries = new uint16[](2);

        vm.prank(issuer);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ArrayLengthMismatch.selector);
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 27: DELETE — Deleting unregistered investor reverts
    // ============================================
    function test_DeleteIdentity_NotRegistered() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityNotRegistered.selector,
                karim
            )
        );
        registry.deleteIdentity(karim);
    }

    // ============================================
    // TEST 28: UPDATE — Updating unregistered investor reverts
    // ============================================
    function test_UpdateIdentity_NotRegistered() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityNotRegistered.selector,
                karim
            )
        );
        registry.updateIdentity(karim, address(mockIdentity));
    }

    // ============================================
    // TEST 29b: UPDATE IDENTITY — Zero address investor reverts
    // ============================================
    function test_UpdateIdentity_ZeroAddressInvestor() public {
        vm.prank(issuer);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.updateIdentity(address(0), address(mockIdentity));
    }

    // ============================================
    // TEST 30: GETTERS — Individual getters return correct values
    // ============================================
    function test_Getters_AfterRegistration() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        assertEq(registry.identity(karim), address(mockIdentity), "identity() getter");
        assertEq(registry.investorCountry(karim), COUNTRY_UAE, "investorCountry() getter");
        assertEq(uint256(registry.investorType(karim)), uint256(IIdentityRegistry.InvestorType.Retail), "investorType() = Retail by default");
        assertEq(registry.kycExpiry(karim), block.timestamp + 365 days, "kycExpiry() = 1 year by default");
        assertTrue(registry.contains(karim), "contains() getter");
    }

    // ============================================
    // TEST 30: INVESTOR TYPE — Update investor type
    // ============================================
    function test_UpdateInvestorType() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        registry.updateInvestorType(karim, IIdentityRegistry.InvestorType.Accredited);

        assertEq(
            uint256(registry.investorType(karim)),
            uint256(IIdentityRegistry.InvestorType.Accredited),
            "Type must be Accredited"
        );
    }

    // ============================================
    // TEST 31: INVESTOR TYPE — Update on unregistered reverts
    // ============================================
    function test_UpdateInvestorType_NotRegistered() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityNotRegistered.selector,
                karim
            )
        );
        registry.updateInvestorType(karim, IIdentityRegistry.InvestorType.Accredited);
    }

    // ============================================
    // TEST 32: KYC EXPIRY — Update on unregistered reverts
    // ============================================
    function test_UpdateKYCExpiry_NotRegistered() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityNotRegistered.selector,
                karim
            )
        );
        registry.updateKYCExpiry(karim, block.timestamp + 30 days);
    }

    // ============================================
    // TEST 33: KYC EXPIRY — Getter returns correct value
    // ============================================
    function test_KYCExpiry_Getter() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        uint256 expiry = block.timestamp + 90 days;
        vm.prank(issuer);
        registry.updateKYCExpiry(karim, expiry);

        assertEq(registry.kycExpiry(karim), expiry, "kycExpiry() must match");
    }

    // ============================================
    // TEST 34: TRUSTED ISSUER — Update claim topics
    // ============================================
    function test_UpdateTrustedIssuerClaimTopics() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](2);
        topics[0] = 1;
        topics[1] = 2;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        uint256[] memory newTopics = new uint256[](1);
        newTopics[0] = 3;

        vm.prank(admin);
        registry.updateTrustedIssuerClaimTopics(issuer1, newTopics);

        uint256[] memory storedTopics = registry.getTrustedIssuerClaimTopics(issuer1);
        assertEq(storedTopics.length, 1, "Topics length must be 1");
        assertEq(storedTopics[0], 3, "Topic must be 3");
    }

    // ============================================
    // TEST 35: TRUSTED ISSUER — Remove non-existent reverts
    // ============================================
    function test_RemoveTrustedIssuer_NotExistent() public {
        address randomIssuer = makeAddr("randomIssuer");

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__NotAuthorizedIssuer.selector,
                randomIssuer
            )
        );
        registry.removeTrustedIssuer(randomIssuer);
    }

    // ============================================
    // TEST 36: TRUSTED ISSUER — Add duplicate reverts
    // ============================================
    function test_AddTrustedIssuer_Duplicate() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityAlreadyExists.selector,
                issuer1
            )
        );
        registry.addTrustedIssuer(issuer1, topics);
    }

    // ============================================
    // TEST 37: TRUSTED ISSUER — Zero address reverts
    // ============================================
    function test_AddTrustedIssuer_ZeroAddress() public {
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.addTrustedIssuer(address(0), topics);
    }

    // ============================================
    // TEST 38: TRUSTED ISSUER — Add empty topics reverts
    // ============================================
    function test_AddTrustedIssuer_EmptyTopics() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](0);

        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ArrayLengthMismatch.selector);
        registry.addTrustedIssuer(issuer1, topics);
    }

    // ============================================
    // TEST 38: TRUSTED ISSUER — Update non-existent reverts
    // ============================================
    function test_UpdateTrustedIssuer_NotExistent() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__NotAuthorizedIssuer.selector,
                issuer1
            )
        );
        registry.updateTrustedIssuerClaimTopics(issuer1, topics);
    }

    // ============================================
    // TEST 39: TRUSTED ISSUER — Update empty topics reverts
    // ============================================
    function test_UpdateTrustedIssuer_EmptyTopics() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        uint256[] memory emptyTopics = new uint256[](0);
        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ArrayLengthMismatch.selector);
        registry.updateTrustedIssuerClaimTopics(issuer1, emptyTopics);
    }

    // ============================================
    // TEST 40: UPDATE COUNTRY — Not registered reverts
    // ============================================
    function test_UpdateCountry_NotRegistered() public {
        address stranger = makeAddr("stranger");

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityNotRegistered.selector,
                stranger
            )
        );
        registry.updateCountry(stranger, 250);
    }

    // ============================================
    // TEST 41: BATCH REGISTER — Too large reverts
    // ============================================
    function test_BatchRegister_TooLarge() public {
        address[] memory investors = new address[](201);
        address[] memory identities = new address[](201);
        uint16[] memory countries = new uint16[](201);

        for (uint256 i = 0; i < 201; i++) {
            investors[i] = makeAddr(string(abi.encodePacked("investor", i)));
            identities[i] = address(new MockIdentity());
            countries[i] = 250;
        }

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__BatchSizeExceeded.selector,
                201
            )
        );
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 42: BATCH REGISTER — Zero address in batch reverts
    // ============================================
    function test_BatchRegister_ZeroAddressInBatch() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = address(0);
        identities[0] = address(new MockIdentity());
        identities[1] = address(new MockIdentity());
        countries[0] = 250;
        countries[1] = 250;

        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 43: BATCH REGISTER — EOA identity in batch reverts
    // ============================================
    function test_BatchRegister_EOAInBatch() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = makeAddr("investor2");
        identities[0] = address(new MockIdentity());
        identities[1] = makeAddr("eoa");
        countries[0] = 250;
        countries[1] = 250;

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidIdentity.selector,
                identities[1]
            )
        );
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 44: BATCH REGISTER — Invalid country in batch reverts
    // ============================================
    function test_BatchRegister_InvalidCountryInBatch() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = makeAddr("investor2");
        identities[0] = address(new MockIdentity());
        identities[1] = address(new MockIdentity());
        countries[0] = 250;
        countries[1] = 0;

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidCountryCode.selector,
                0
            )
        );
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 45: BATCH REGISTER — Duplicate in batch reverts
    // ============================================
    function test_BatchRegister_DuplicateInBatch() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = investors[0]; // duplicate
        identities[0] = address(new MockIdentity());
        identities[1] = address(new MockIdentity());
        countries[0] = 250;
        countries[1] = 250;

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityAlreadyExists.selector,
                investors[0]
            )
        );
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 46: isVerifiedWithDetails — Unverified status
    // ============================================
    function test_IsVerifiedWithDetails_Unverified() public {
        (IIdentityRegistry.VerificationStatus status, IIdentityRegistry.InvestorType invType) = registry.isVerifiedWithDetails(karim);
        assertEq(uint256(status), uint256(IIdentityRegistry.VerificationStatus.Unverified));
        assertEq(uint256(invType), uint256(IIdentityRegistry.InvestorType.Retail));
    }

    // ============================================
    // TEST 47: isVerifiedWithDetails — Verified status
    // ============================================
    function test_IsVerifiedWithDetails_Verified() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        (IIdentityRegistry.VerificationStatus status, IIdentityRegistry.InvestorType invType) = registry.isVerifiedWithDetails(karim);
        assertEq(uint256(status), uint256(IIdentityRegistry.VerificationStatus.Verified));
        assertEq(uint256(invType), uint256(IIdentityRegistry.InvestorType.Retail));
    }

    // ============================================
    // TEST 48: isVerifiedWithDetails — Expired status
    // ============================================
    function test_IsVerifiedWithDetails_Expired() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.warp(block.timestamp + 2 * 365 days);

        (IIdentityRegistry.VerificationStatus status, IIdentityRegistry.InvestorType invType) = registry.isVerifiedWithDetails(karim);
        assertEq(uint256(status), uint256(IIdentityRegistry.VerificationStatus.Expired));
        assertEq(uint256(invType), uint256(IIdentityRegistry.InvestorType.Retail));
    }

    // ============================================
    // TEST 49: isVerifiedWithDetails — Revoked status (identity destroyed)
    // ============================================
    function test_IsVerifiedWithDetails_Revoked() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        // Simulate identity contract destruction (code.length == 0)
        vm.etch(address(mockIdentity), "");

        (IIdentityRegistry.VerificationStatus status, ) = registry.isVerifiedWithDetails(karim);
        assertEq(uint256(status), uint256(IIdentityRegistry.VerificationStatus.Revoked));
    }

    // ============================================
    // TEST 50: registerIdentity overload — Accredited + custom KYC expiry
    // ============================================
    function test_RegisterIdentity_Overload_Accredited() public {
        uint256 customExpiry = block.timestamp + 180 days;

        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE, IIdentityRegistry.InvestorType.Accredited, customExpiry);

        assertTrue(registry.isVerified(karim));
        assertEq(uint256(registry.investorType(karim)), uint256(IIdentityRegistry.InvestorType.Accredited));
        assertEq(registry.kycExpiry(karim), customExpiry);
    }

    // ============================================
    // TEST 51: registerIdentity overload — KYC expired reverts
    // ============================================
    function test_RegisterIdentity_Overload_KYCExpired() public {
        uint256 expiredExpiry = block.timestamp - 1;

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__KYCExpired.selector,
                karim
            )
        );
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE, IIdentityRegistry.InvestorType.Accredited, expiredExpiry);
    }

    // ============================================
    // TEST 52: setIdentityRegistryStorage — emits event
    // ============================================
    function test_SetIdentityRegistryStorage() public {
        address newStorage = makeAddr("newStorage");

        vm.expectEmit(true, false, false, false);
        emit IdentityRegistryStorageSet(newStorage);

        vm.prank(admin);
        registry.setIdentityRegistryStorage(newStorage);
        assertEq(registry.getIdentityRegistryStorage(), newStorage);
    }

    // ============================================
    // TEST 53: setIdentityRegistryStorage — Zero address reverts
    // ============================================
    function test_SetIdentityRegistryStorage_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.setIdentityRegistryStorage(address(0));
    }

    // ============================================
    // TEST 54: setClaimTopicsRegistry — emits event
    // ============================================
    function test_SetClaimTopicsRegistry() public {
        address newRegistry = makeAddr("newRegistry");

        vm.expectEmit(true, false, false, false);
        emit ClaimTopicsRegistrySet(newRegistry);

        vm.prank(admin);
        registry.setClaimTopicsRegistry(newRegistry);
        assertEq(registry.getClaimTopicsRegistry(), newRegistry);
    }

    // ============================================
    // TEST 55: setClaimTopicsRegistry — Zero address reverts
    // ============================================
    function test_SetClaimTopicsRegistry_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.setClaimTopicsRegistry(address(0));
    }

    // ============================================
    // TEST 56: setTrustedIssuersRegistry — emits event
    // ============================================
    function test_SetTrustedIssuersRegistry() public {
        address newRegistry = makeAddr("newRegistry");

        vm.expectEmit(true, false, false, false);
        emit TrustedIssuersRegistrySet(newRegistry);

        vm.prank(admin);
        registry.setTrustedIssuersRegistry(newRegistry);
        assertEq(registry.getTrustedIssuersRegistry(), newRegistry);
    }

    // ============================================
    // TEST 57: setTrustedIssuersRegistry — Zero address reverts
    // ============================================
    function test_SetTrustedIssuersRegistry_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.setTrustedIssuersRegistry(address(0));
    }

    // ============================================
    // TEST 58: updateTrustedIssuerClaimTopics — emits event
    // ============================================
    function test_UpdateTrustedIssuerClaimTopics_EmitsEvent() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);

        uint256[] memory newTopics = new uint256[](1);
        newTopics[0] = 3;

        vm.expectEmit(true, false, true, false);
        emit TrustedIssuerClaimTopicsUpdated(issuer1, newTopics, admin);

        vm.prank(admin);
        registry.updateTrustedIssuerClaimTopics(issuer1, newTopics);
    }

    // ============================================
    // TEST 59: updateIdentity — Zero address identity reverts
    // ============================================
    function test_UpdateIdentity_ZeroAddressIdentity() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.updateIdentity(karim, address(0));
    }

    // ============================================
    // TEST 60: updateIdentity — EOA identity reverts
    // ============================================
    function test_UpdateIdentity_EOAIdentity() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidIdentity.selector,
                bob
            )
        );
        registry.updateIdentity(karim, bob);
    }

    // ============================================
    // TEST 61: getTrustedIssuers — Empty array initially
    // ============================================
    function test_GetTrustedIssuers_Empty() public {
        address[] memory issuers = registry.getTrustedIssuers();
        assertEq(issuers.length, 0, "Must be empty initially");
    }

    // ============================================
    // TEST 62: isTrustedIssuer — False for random address
    // ============================================
    function test_IsTrustedIssuer_False() public {
        assertFalse(registry.isTrustedIssuer(makeAddr("random")));
    }

    // ============================================
    // TEST 63: getTrustedIssuerClaimTopics — Empty for non-trusted
    // ============================================
    function test_GetTrustedIssuerClaimTopics_Empty() public {
        uint256[] memory topics = registry.getTrustedIssuerClaimTopics(makeAddr("random"));
        assertEq(topics.length, 0);
    }

    // ============================================
    // TEST 64: batchRegisterIdentity — Empty array reverts
    // ============================================
    function test_BatchRegisterIdentity_EmptyArray() public {
        address[] memory investors = new address[](0);
        address[] memory identities = new address[](0);
        uint16[] memory countries = new uint16[](0);

        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ArrayLengthMismatch.selector);
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 65: removeTrustedIssuer — single element (no swap path)
    // ============================================
    function test_RemoveTrustedIssuer_Single() public {
        address issuer1 = makeAddr("issuer1");
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1;

        vm.prank(admin);
        registry.addTrustedIssuer(issuer1, topics);
        assertEq(registry.getTrustedIssuers().length, 1);

        vm.prank(admin);
        registry.removeTrustedIssuer(issuer1);

        assertFalse(registry.isTrustedIssuer(issuer1));
        assertEq(registry.getTrustedIssuers().length, 0);
    }

    // ============================================
    // TEST 66: batchRegisterIdentity — identity zero address in batch
    // ============================================
    function test_BatchRegister_IdentityZeroAddress() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = makeAddr("investor2");
        identities[0] = address(new MockIdentity());
        identities[1] = address(0);
        countries[0] = 250;
        countries[1] = 250;

        vm.prank(admin);
        vm.expectRevert(IIdentityRegistry.IIdentityRegistry__ZeroAddress.selector);
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // TEST 67: registerIdentity — country > 999 reverts
    // ============================================
    function test_RegisterIdentity_CountryOver999() public {
        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidCountryCode.selector,
                1000
            )
        );
        registry.registerIdentity(karim, address(mockIdentity), 1000);
    }

    // ============================================
    // TEST 68: batchRegisterIdentity — country > 999 in batch reverts
    // ============================================
    function test_BatchRegister_CountryOver999() public {
        address[] memory investors = new address[](2);
        address[] memory identities = new address[](2);
        uint16[] memory countries = new uint16[](2);

        investors[0] = makeAddr("investor1");
        investors[1] = makeAddr("investor2");
        identities[0] = address(new MockIdentity());
        identities[1] = address(new MockIdentity());
        countries[0] = 250;
        countries[1] = 1000;

        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__InvalidCountryCode.selector,
                1000
            )
        );
        registry.batchRegisterIdentity(investors, identities, countries);
    }

    // ============================================
    // WORKAROUND: cover defensive branches via try/catch (forge coverage bug with reverts)
    // ============================================
    function test_IsVerified_Revoked() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
        vm.etch(address(mockIdentity), "");
        assertFalse(registry.isVerified(karim));
    }

    function test_ValidCountry_CoverageWorkaround() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        try registry.updateCountry(karim, 1000) {
            assertTrue(false, "Should revert");
        } catch {
            // branch covered
        }
    }

    function test_IsContract_CoverageWorkaround() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);

        vm.prank(issuer);
        try registry.updateIdentity(karim, makeAddr("eoa")) {
            assertTrue(false, "Should revert");
        } catch {
            // branch covered
        }
    }

    function test_RegisterIdentityOverload_Duplicate_CoverageWorkaround() public {
        vm.prank(issuer);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE, IIdentityRegistry.InvestorType.Accredited, block.timestamp + 365 days);

        vm.prank(issuer);
        try registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE, IIdentityRegistry.InvestorType.Accredited, block.timestamp + 365 days) {
            assertTrue(false, "Should revert");
        } catch {
            // branch covered
        }
    }

}
