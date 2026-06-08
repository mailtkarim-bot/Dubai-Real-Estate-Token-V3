// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../../src/compliance/ComplianceEngine.sol";
import "../../src/compliance/IdentityRegistry.sol";
import "../../src/interfaces/IIdentityRegistry.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MockIdentity
 * @notice Dummy identity contract for IdentityRegistry extcodesize check.
 */
contract MockIdentity {
    // Intentionally empty.
}

/**
 * @title ComplianceEngineTest
 * @notice Unit tests for the regulatory compliance engine.
 * @dev Real-world analogy: VARA regulator checking if an investor
 *      is allowed to buy/sell tokenized real estate.
 */
contract ComplianceEngineTest is Test {

    // ============================================
    // CONTRACTS UNDER TEST
    // ============================================
    ComplianceEngine public compliance;
    IdentityRegistry public registry;
    MockIdentity public mockIdentity;

    // ============================================
    // ACTORS
    // ============================================
    address public admin;      // Project owner
    address public regulator;  // VARA officer
    address public hacker;     // Unauthorized actor
    address public karim;      // Investor UAE
    address public bob;        // Investor France
    address public ali;        // Investor Iran (restricted)

    // ============================================
    // CONSTANTS
    // ============================================
    uint16 constant COUNTRY_UAE = 784;
    uint16 constant COUNTRY_FRANCE = 250;
    uint16 constant COUNTRY_IRAN = 364;

    // ============================================
    // EVENTS (redeclared for vm.expectEmit)
    // ============================================
    event InvestorFrozen(address indexed investor, string reason, uint256 timestamp, address indexed actor);
    event InvestorUnfrozen(address indexed investor, uint256 timestamp, address indexed actor);
    event CountryRestricted(uint16 indexed country, uint256 timestamp, address indexed actor);
    event CountryUnrestricted(uint16 indexed country, uint256 timestamp, address indexed actor);
    event WhitelistEnabled(bool enabled, uint256 timestamp, address indexed actor);
    event WhitelistUpdated(address indexed account, bool status, address indexed actor);
    event IdentityRegistrySet(address indexed registry);

    // ============================================
    // SETUP
    // ============================================
    function setUp() public {
        admin     = makeAddr("admin");
        regulator = makeAddr("regulator");
        hacker    = makeAddr("hacker");
        karim     = makeAddr("karim");
        bob       = makeAddr("bob");
        ali       = makeAddr("ali");

        // Deploy IdentityRegistry
        vm.startPrank(admin);
        registry = new IdentityRegistry(admin);
        registry.grantRole(registry.ISSUER_ROLE(), admin);
        vm.stopPrank();

        // Deploy ComplianceEngine linked to Registry
        vm.startPrank(admin);
        compliance = new ComplianceEngine(admin, address(registry));
        compliance.grantRole(compliance.REGULATOR_ROLE(), regulator);
        vm.stopPrank();

        // Deploy mock identity
        mockIdentity = new MockIdentity();

        // Register investors in IdentityRegistry (needed for compliance checks)
        vm.startPrank(admin);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
        registry.registerIdentity(bob, address(mockIdentity), COUNTRY_FRANCE);
        registry.registerIdentity(ali, address(mockIdentity), COUNTRY_IRAN);
        vm.stopPrank();
    }

    // ============================================
    // TEST 1: DEPLOYMENT — Roles assigned correctly
    // ============================================
    function test_DeploymentRoles() public view {
        assertTrue(compliance.hasRole(compliance.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(compliance.hasRole(compliance.REGULATOR_ROLE(), admin));
        assertTrue(compliance.hasRole(compliance.REGULATOR_ROLE(), regulator));
        assertEq(address(compliance.identityRegistry()), address(registry));
    }

    // ============================================
    // TEST 2: HAPPY PATH — Verified investors can transfer
    // ============================================
    function test_IsCompliant_ValidTransfer() public view {
        bool result = compliance.isCompliant(karim, bob, 100e18);
        assertTrue(result, "Karim to Bob must be compliant");
    }

    // ============================================
    // TEST 3: HAPPY PATH — Mint to verified investor
    // ============================================
    function test_CanCreate_ToVerified() public view {
        bool result = compliance.canCreate(karim, 100e18);
        assertTrue(result, "Mint to Karim must be allowed");
    }

    // ============================================
    // TEST 4: HAPPY PATH — Burn from verified investor
    // ============================================
    function test_CanDestroy_FromVerified() public view {
        bool result = compliance.canDestroy(karim, 100e18);
        assertTrue(result, "Burn from Karim must be allowed");
    }

    // ============================================
    // TEST 5: COMPLIANCE — Transfer with amount 0 is always allowed
    // ============================================
    function test_IsCompliant_ZeroAmount() public view {
        bool result = compliance.isCompliant(karim, bob, 0);
        assertTrue(result, "Zero amount transfer must always be compliant");
    }

    // ============================================
    // TEST 6: COMPLIANCE — Unverified from address rejected
    // ============================================
    function test_IsCompliant_UnverifiedFrom() public {
        address stranger = makeAddr("stranger");
        bool result = compliance.isCompliant(stranger, bob, 100e18);
        assertFalse(result, "Unverified from must be non-compliant");
    }

    // ============================================
    // TEST 7: COMPLIANCE — Unverified to address rejected
    // ============================================
    function test_IsCompliant_UnverifiedTo() public {
        address stranger = makeAddr("stranger");
        bool result = compliance.isCompliant(karim, stranger, 100e18);
        assertFalse(result, "Unverified to must be non-compliant");
    }

    // ============================================
    // TEST 8: FREEZE — Frozen investor cannot send
    // ============================================
    function test_IsCompliant_FrozenFrom() public {
        vm.prank(regulator);
        compliance.freezeInvestor(karim, "suspicious_activity");

        assertTrue(compliance.isFrozen(karim), "Karim must be frozen");

        bool result = compliance.isCompliant(karim, bob, 100e18);
        assertFalse(result, "Frozen from must be non-compliant");
    }

    // ============================================
    // TEST 9: FREEZE — Frozen investor cannot receive
    // ============================================
    function test_IsCompliant_FrozenTo() public {
        vm.prank(regulator);
        compliance.freezeInvestor(bob, "suspicious_activity");

        bool result = compliance.isCompliant(karim, bob, 100e18);
        assertFalse(result, "Frozen to must be non-compliant");
    }

    // ============================================
    // TEST 10: FREEZE — Unfreeze restores compliance
    // ============================================
    function test_IsCompliant_UnfreezeRestores() public {
        vm.prank(regulator);
        compliance.freezeInvestor(karim, "suspicious_activity");

        assertFalse(compliance.isCompliant(karim, bob, 100e18));

        vm.prank(regulator);
        compliance.unfreezeInvestor(karim);

        assertFalse(compliance.isFrozen(karim), "Karim must be unfrozen");
        assertTrue(compliance.isCompliant(karim, bob, 100e18), "Unfrozen must be compliant again");
    }

    // ============================================
    // TEST 11: FREEZE EVENT — InvestorFrozen emitted
    // ============================================
    function test_FreezeInvestor_EmitsEvent() public {
        vm.expectEmit(true, false, true, true);
        emit InvestorFrozen(karim, "suspicious_activity", block.timestamp, regulator);

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "suspicious_activity");
    }

    // ============================================
    // TEST 12: FREEZE ACL — Non-regulator cannot freeze
    // ============================================
    function test_FreezeInvestor_ByNonRegulator() public {
        bytes32 regRole = compliance.REGULATOR_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                regRole
            )
        );
        compliance.freezeInvestor(karim, "test");
    }

    // ============================================
    // TEST 13: COUNTRY — Restricted country cannot send
    // ============================================
    function test_IsCompliant_RestrictedCountryFrom() public {
        vm.prank(regulator);
        compliance.restrictCountry(COUNTRY_IRAN);

        assertTrue(compliance.isCountryRestricted(COUNTRY_IRAN), "Iran must be restricted");

        bool result = compliance.isCompliant(ali, bob, 100e18);
        assertFalse(result, "Restricted country from must be non-compliant");
    }

    // ============================================
    // TEST 14: COUNTRY — Restricted country cannot receive
    // ============================================
    function test_IsCompliant_RestrictedCountryTo() public {
        vm.prank(regulator);
        compliance.restrictCountry(COUNTRY_IRAN);

        bool result = compliance.isCompliant(karim, ali, 100e18);
        assertFalse(result, "Restricted country to must be non-compliant");
    }

    // ============================================
    // TEST 15: COUNTRY — Unrestrict restores compliance
    // ============================================
    function test_IsCompliant_UnrestrictCountryRestores() public {
        vm.prank(regulator);
        compliance.restrictCountry(COUNTRY_IRAN);
        assertFalse(compliance.isCompliant(ali, bob, 100e18));

        vm.prank(regulator);
        compliance.unrestrictCountry(COUNTRY_IRAN);

        assertFalse(compliance.isCountryRestricted(COUNTRY_IRAN), "Iran must be unrestricted");
        assertTrue(compliance.isCompliant(ali, bob, 100e18), "Unrestricted country must be compliant");
    }

    // ============================================
    // TEST 16: COUNTRY EVENT — CountryRestricted emitted
    // ============================================
    function test_RestrictCountry_EmitsEvent() public {
        vm.expectEmit(true, false, true, false);
        emit CountryRestricted(COUNTRY_IRAN, block.timestamp, regulator);

        vm.prank(regulator);
        compliance.restrictCountry(COUNTRY_IRAN);
    }

    // ============================================
    // TEST 17: COUNTRY ACL — Non-regulator cannot restrict
    // ============================================
    function test_RestrictCountry_ByNonRegulator() public {
        bytes32 regRole = compliance.REGULATOR_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                regRole
            )
        );
        compliance.restrictCountry(COUNTRY_IRAN);
    }

    // ============================================
    // TEST 18: WHITELIST — Whitelist mode blocks non-whitelisted
    // ============================================
    function test_IsCompliant_WhitelistBlocksNonWhitelisted() public {
        // Enable whitelist mode
        vm.prank(admin);
        compliance.setWhitelistEnabled(true);

        assertTrue(compliance.whitelistEnabled(), "Whitelist must be enabled");

        // Karim is NOT whitelisted → non-compliant
        bool result = compliance.isCompliant(bob, karim, 100e18);
        assertFalse(result, "Non-whitelisted to must be blocked");
    }

    // ============================================
    // TEST 19: WHITELIST — Whitelisted investor allowed
    // ============================================
    function test_IsCompliant_WhitelistedAllowed() public {
        vm.prank(admin);
        compliance.setWhitelistEnabled(true);

        vm.prank(regulator);
        compliance.setWhitelisted(karim, true);

        assertTrue(compliance.isWhitelisted(karim), "Karim must be whitelisted");

        bool result = compliance.isCompliant(bob, karim, 100e18);
        assertTrue(result, "Whitelisted to must be allowed");
    }

    // ============================================
    // TEST 20: WHITELIST — Disabled whitelist allows everyone
    // ============================================
    function test_IsCompliant_WhitelistDisabledAllowsAll() public {
        // Whitelist enabled, Karim not whitelisted
        vm.prank(admin);
        compliance.setWhitelistEnabled(true);

        assertFalse(compliance.isWhitelisted(karim), "Karim must not be whitelisted");
        assertFalse(compliance.isCompliant(bob, karim, 100e18));

        // Disable whitelist
        vm.prank(admin);
        compliance.setWhitelistEnabled(false);

        assertFalse(compliance.whitelistEnabled(), "Whitelist must be disabled");
        assertTrue(compliance.isCompliant(bob, karim, 100e18), "All must be allowed when disabled");
    }

    // ============================================
    // TEST 21: WHITELIST EVENT — WhitelistUpdated emitted
    // ============================================
    function test_SetWhitelisted_EmitsEvent() public {
        vm.expectEmit(true, false, true, false);
        emit WhitelistUpdated(karim, true, regulator);

        vm.prank(regulator);
        compliance.setWhitelisted(karim, true);
    }

    // ============================================
    // TEST 22: PAUSABLE — isCompliant returns false when paused
    // ============================================
    function test_IsCompliant_WhenPaused() public {
        vm.prank(admin);
        compliance.pause();

        assertTrue(compliance.paused(), "Must be paused");

        // Even a valid transfer is non-compliant when paused
        bool result = compliance.isCompliant(karim, bob, 100e18);
        assertFalse(result, "Must be non-compliant when paused");
    }

    // ============================================
    // TEST 23: PAUSABLE — canCreate returns false when paused
    // ============================================
    function test_CanCreate_WhenPaused() public {
        vm.prank(admin);
        compliance.pause();

        bool result = compliance.canCreate(karim, 100e18);
        assertFalse(result, "Mint must be blocked when paused");
    }

    // ============================================
    // TEST 24: PAUSABLE — Non-admin cannot pause
    // ============================================
    function test_Pause_ByNonAdmin() public {
        bytes32 adminRole = compliance.DEFAULT_ADMIN_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        compliance.pause();
    }

    // ============================================
    // TEST 25: REGISTRY LINK — Admin can set new registry
    // ============================================
    function test_SetIdentityRegistry_ByAdmin() public {
        address newRegistry = makeAddr("newRegistry");

        // Deploy a dummy contract at that address so nonZeroAddress passes
        // For test purposes we just need any non-zero address with code
        vm.expectEmit(true, false, false, false);
        emit IdentityRegistrySet(newRegistry);

        vm.prank(admin);
        compliance.setIdentityRegistry(newRegistry);

        assertEq(address(compliance.identityRegistry()), newRegistry, "Registry must be updated");
    }

    // ============================================
    // TEST 26: REGISTRY LINK — Non-admin cannot set registry
    // ============================================
    function test_SetIdentityRegistry_ByNonAdmin() public {
        bytes32 adminRole = compliance.DEFAULT_ADMIN_ROLE();
        address newRegistry = makeAddr("newRegistry");

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        compliance.setIdentityRegistry(newRegistry);
    }

    // ============================================
    // TEST 27: REGISTRY LINK — Zero address reverts
    // ============================================
    function test_SetIdentityRegistry_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(ComplianceEngine.ComplianceEngine__ZeroAddress.selector);
        compliance.setIdentityRegistry(address(0));
    }

    // ============================================
    // TEST 28: BIND TOKEN — Admin can bind token
    // ============================================
    function test_BindToken_ByAdmin() public {
        address tokenAddr = makeAddr("token");

        vm.prank(admin);
        compliance.bindToken(tokenAddr);

        assertEq(compliance.token(), tokenAddr, "Token must be bound");
    }

    // ============================================
    // TEST 29: BIND TOKEN — Non-admin cannot bind
    // ============================================
    function test_BindToken_ByNonAdmin() public {
        bytes32 adminRole = compliance.DEFAULT_ADMIN_ROLE();
        address tokenAddr = makeAddr("token");

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        compliance.bindToken(tokenAddr);
    }

    // ============================================
    // TEST 30: UNPAUSE — Admin can unpause and restore transfers
    // ============================================
    function test_Unpause_RestoresTransfers() public {
        vm.prank(admin);
        compliance.pause();
        assertTrue(compliance.paused());
        assertFalse(compliance.isCompliant(karim, bob, 100e18));

        vm.prank(admin);
        compliance.unpause();

        assertFalse(compliance.paused(), "Must be unpaused");
        assertTrue(compliance.isCompliant(karim, bob, 100e18), "Transfers must work after unpause");
    }

    // ============================================
    // TEST 31: UNPAUSE — Non-admin cannot unpause
    // ============================================
    function test_Unpause_ByNonAdmin() public {
        bytes32 adminRole = compliance.DEFAULT_ADMIN_ROLE();

        vm.prank(admin);
        compliance.pause();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        compliance.unpause();
    }

    // ============================================
    // TEST 32: ZERO AMOUNT — Frozen accounts are blocked even at zero amount (v2.1 security fix)
    // ============================================
    function test_IsCompliant_ZeroAmount_FrozenStillBlocked() public {
        vm.prank(regulator);
        compliance.freezeInvestor(bob, "test");

        // Amount == 0 NO LONGER bypasses freeze (security fix v2.1)
        bool result = compliance.isCompliant(karim, bob, 0);
        assertFalse(result, "Frozen to must be blocked even at zero amount");
    }

    // ============================================
    // TEST 33: CAN CREATE — To unverified rejected
    // ============================================
    function test_CanCreate_ToUnverified() public {
        address stranger = makeAddr("stranger");
        bool result = compliance.canCreate(stranger, 100e18);
        assertFalse(result, "Mint to unverified must be rejected");
    }

    // ============================================
    // TEST 34: CAN DESTROY — From unverified rejected
    // ============================================
    function test_CanDestroy_FromUnverified() public {
        address stranger = makeAddr("stranger");
        bool result = compliance.canDestroy(stranger, 100e18);
        assertFalse(result, "Burn from unverified must be rejected");
    }

    // ============================================
    // TEST 35: MODULARITY — Stubs do not modify state (documented behavior)
    // ============================================
    function test_AddModule_DoesNotModifyState() public {
        address fakeModule = makeAddr("module");

        vm.prank(admin);
        compliance.addModule(fakeModule);

        assertEq(compliance.getModules().length, 0, "getModules must remain empty - stub for Phase 2");
        assertFalse(compliance.isModuleBound(fakeModule), "isModuleBound must be false - stub for Phase 2");
    }

    // ============================================
    // TEST 36: UNBIND TOKEN — Admin can unbind
    // ============================================
    function test_UnbindToken_ByAdmin() public {
        address tokenAddr = makeAddr("token");

        vm.prank(admin);
        compliance.bindToken(tokenAddr);
        assertEq(compliance.token(), tokenAddr);

        vm.prank(admin);
        compliance.unbindToken(tokenAddr);

        assertEq(compliance.token(), address(0), "Token must be unbound");
    }

    // ============================================
    // TEST 37: UNBIND TOKEN — Non-admin cannot unbind
    // ============================================
    function test_UnbindToken_ByNonAdmin() public {
        bytes32 adminRole = compliance.DEFAULT_ADMIN_ROLE();
        address tokenAddr = makeAddr("token");

        vm.prank(admin);
        compliance.bindToken(tokenAddr);

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        compliance.unbindToken(tokenAddr);
    }

    // ============================================
    // TEST 38: CONSTRUCTOR — Zero address admin reverts
    // ============================================
    function test_Constructor_ZeroAddressAdmin() public {
        vm.expectRevert(ComplianceEngine.ComplianceEngine__ZeroAddress.selector);
        new ComplianceEngine(address(0), address(registry));
    }

    // ============================================
    // TEST 39: CONSTRUCTOR — Zero address registry reverts
    // ============================================
    function test_Constructor_ZeroAddressRegistry() public {
        vm.expectRevert(ComplianceEngine.ComplianceEngine__ZeroAddress.selector);
        new ComplianceEngine(admin, address(0));
    }

    // ============================================
    // TEST 40: transferred hook (stub) — does not revert
    // ============================================
    function test_TransferredHook() public {
        vm.prank(admin);
        compliance.transferred(karim, bob, 100e18);
    }

    // ============================================
    // TEST 41: created hook (stub) — does not revert
    // ============================================
    function test_CreatedHook() public {
        vm.prank(admin);
        compliance.created(bob, 100e18);
    }

    // ============================================
    // TEST 42: destroyed hook (stub) — does not revert
    // ============================================
    function test_DestroyedHook() public {
        vm.prank(admin);
        compliance.destroyed(karim, 100e18);
    }

    // ============================================
    // TEST 43: unbindToken — mismatch reverts with TokenMismatch
    // ============================================
    function test_UnbindToken_MismatchReverts() public {
        address tokenAddr = makeAddr("token");
        vm.prank(admin);
        compliance.bindToken(tokenAddr);

        vm.prank(admin);
        vm.expectRevert(ComplianceEngine.ComplianceEngine__TokenMismatch.selector);
        compliance.unbindToken(makeAddr("wrong"));
    }

    // ============================================
    // TEST 44: getModules — returns empty array (stub)
    // ============================================
    function test_GetModules() public {
        address[] memory modules = compliance.getModules();
        assertEq(modules.length, 0);
    }

    // ============================================
    // TEST 45: isModuleBound — returns false for unbound module (stub)
    // ============================================
    function test_IsModuleBound() public {
        assertFalse(compliance.isModuleBound(makeAddr("fake")));
    }

    // ============================================
    // TEST 46: bindToken — Zero address reverts
    // ============================================
    function test_BindToken_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(ComplianceEngine.ComplianceEngine__ZeroAddress.selector);
        compliance.bindToken(address(0));
    }

}