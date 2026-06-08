// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../../src/core/DubaiRealEstateToken.sol";
import "../../src/compliance/IdentityRegistry.sol";
import "../../src/compliance/ComplianceEngine.sol";
import "../../src/interfaces/IIdentityRegistry.sol";
import "../mocks/MockUSDC.sol";
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
 * @title DubaiRealEstateTokenTest
 * @notice Unit tests for the Dubai RWA real estate security token.
 * @dev Tests cover: mint, burn, transfer, dividends, freeze, forced ops.
 */
contract DubaiRealEstateTokenTest is Test {

    // ============================================
    // CONTRACTS
    // ============================================
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;
    MockIdentity public mockIdentity;

    // ============================================
    // ACTORS
    // ============================================
    address public admin;
    address public issuer;
    address public regulator;
    address public karim;
    address public bob;
    address public hacker;

    // ============================================
    // CONSTANTS
    // ============================================
    uint16 constant COUNTRY_UAE = 784;
    uint16 constant COUNTRY_FRANCE = 250;
    uint256 constant INITIAL_MINT = 1000e18;

    // ============================================
    // EVENTS (redeclared for vm.expectEmit)
    // ============================================
    event TokensMinted(address indexed to, uint256 amount, address indexed actor);
    event TokensBurned(address indexed from, uint256 amount, address indexed actor);
    event DividendsDistributed(uint256 amount, uint256 newDividendPerToken, uint256 totalDividendPerToken, address indexed actor);
    event DividendClaimed(address indexed by, uint256 amount);
    event DividendSynced(address indexed investor, uint256 amount);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount, string reason, address indexed actor);
    event ForcedBurn(address indexed from, uint256 amount, string reason, address indexed actor);
    event InvestorFrozen(address indexed investor, string reason, uint256 timestamp, address indexed actor);
    event InvestorUnfrozen(address indexed investor, uint256 timestamp, address indexed actor);

    // ============================================
    // SETUP
    // ============================================
    function setUp() public {
        admin     = makeAddr("admin");
        issuer    = makeAddr("issuer");
        regulator = makeAddr("regulator");
        karim     = makeAddr("karim");
        bob       = makeAddr("bob");
        hacker    = makeAddr("hacker");

        // Deploy USDC mock
        vm.prank(admin);
        usdc = new MockUSDC();

        // Give USDC to issuer for dividend distribution (admin is owner of MockUSDC)
        uint256 usdcDecimals = usdc.decimals();
        vm.prank(admin);
        usdc.mint(issuer, 1_000_000_000 * 10 ** usdcDecimals);

        // Deploy IdentityRegistry
        vm.startPrank(admin);
        registry = new IdentityRegistry(admin);
        registry.grantRole(registry.ISSUER_ROLE(), admin);
        registry.grantRole(registry.ISSUER_ROLE(), issuer);

        // Deploy ComplianceEngine
        compliance = new ComplianceEngine(admin, address(registry));
        compliance.grantRole(compliance.REGULATOR_ROLE(), regulator);

        // Deploy Token
        token = new DubaiRealEstateToken(
            address(usdc),
            address(registry),
            address(compliance),
            "Dubai Real Estate",
            "DREIT",
            admin
        );
        token.grantRole(token.ISSUER_ROLE(), issuer);
        token.grantRole(token.REGULATOR_ROLE(), regulator);

        // Link registry to token for balance checks in deleteIdentity
        registry.setToken(address(token));
        vm.stopPrank();

        // Deploy mock identity
        mockIdentity = new MockIdentity();

        // Register investors in IdentityRegistry
        vm.startPrank(admin);
        registry.registerIdentity(karim, address(mockIdentity), COUNTRY_UAE);
        registry.registerIdentity(bob, address(mockIdentity), COUNTRY_FRANCE);
        vm.stopPrank();
    }

    // ============================================
    // TEST 1: DEPLOYMENT — Roles assigned correctly
    // ============================================
    function test_DeploymentRoles() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(token.hasRole(token.ISSUER_ROLE(), admin));
        assertTrue(token.hasRole(token.REGULATOR_ROLE(), admin));
        assertTrue(token.hasRole(token.ISSUER_ROLE(), issuer));
        assertTrue(token.hasRole(token.REGULATOR_ROLE(), regulator));
    }

    // ============================================
    // TEST 2: DEPLOYMENT — MAX_SUPPLY correct
    // ============================================
    function test_MaxSupply() public view {
        assertEq(token.MAX_SUPPLY(), 50_000 * 10 ** 18, "MAX_SUPPLY must be 50,000");
    }

    // ============================================
    // TEST 3: MINT — Happy path
    // ============================================
    function test_Mint_Success() public {
        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);

        assertEq(token.balanceOf(karim), INITIAL_MINT, "Karim must have 1000 tokens");
        assertEq(token.totalSupply(), INITIAL_MINT, "Total supply must be 1000");
    }

    // ============================================
    // TEST 4: MINT — Emits TokensMinted event
    // ============================================
    function test_Mint_EmitsEvent() public {
        vm.expectEmit(true, false, true, false);
        emit TokensMinted(karim, INITIAL_MINT, issuer);

        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);
    }

    // ============================================
    // TEST 5: MINT — Without ISSUER_ROLE reverts
    // ============================================
    function test_Mint_NotIssuerRole() public {
        bytes32 issuerRole = token.ISSUER_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                issuerRole
            )
        );
        token.mint(karim, INITIAL_MINT);
    }

    // ============================================
    // TEST 6: MINT — Exceeds MAX_SUPPLY reverts
    // ============================================
    function test_Mint_ExceedsMaxSupply() public {
        uint256 tooMuch = 60_000 * 10 ** 18;
        uint256 maxSupply = token.MAX_SUPPLY();

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__MaxSupplyExceeded.selector,
                tooMuch,
                maxSupply
            )
        );
        token.mint(karim, tooMuch);
    }

    // ============================================
    // TEST 7: MINT — Zero amount reverts
    // ============================================
    function test_Mint_ZeroAmount() public {
        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.mint(karim, 0);
    }

    // ============================================
    // TEST 8: MINT — To unverified address reverts
    // ============================================
    function test_Mint_UnverifiedTo() public {
        address stranger = makeAddr("stranger");

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                stranger
            )
        );
        token.mint(stranger, INITIAL_MINT);
    }

    // ============================================
    // TEST 9: MINT — Anti-retroactivity for new holder
    // ============================================
    function test_Mint_AntiRetroactivity() public {
        // First mint some tokens so totalSupply > 0
        vm.prank(issuer);
        token.mint(bob, INITIAL_MINT);

        // Distribute dividends before Karim mints
        _distributeDividends(10_000 * 1e6);

        // Mint to Karim (new holder)
        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);

        // Karim should NOT be able to claim past dividends
        assertEq(token.getClaimableDividends(karim), 0, "New holder must have 0 claimable");
    }

    // ============================================
    // TEST 10: MINT — Second mint syncs dividends
    // ============================================
    function test_Mint_SecondMintSyncsDividends() public {
        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);
        vm.prank(issuer);
        token.mint(bob, 2 * INITIAL_MINT);

        _distributeDividends(10_000 * 1e6);

        // Second mint to Karim should sync his pending dividends first
        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);

        // Karim had 1000 tokens during distribution of 10_000 USDC over 3000 total
        // dividendPerToken = (10_000 * 1e6) * 1e18 / 3000e18 = 3333333
        // Karim's share = 1000e18 * 3333333 / 1e18 = 3333333000
        assertEq(
            token.getClaimableDividends(karim),
            3333333000,
            "Dividends must be synced"
        );
    }

    // ============================================
    // TEST 10b: REGISTRY — deleteIdentity rejects if holder has balance
    // ============================================
    function test_DeleteIdentity_HasBalance() public {
        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                IIdentityRegistry.IIdentityRegistry__IdentityHasBalance.selector,
                karim
            )
        );
        registry.deleteIdentity(karim);
    }

    // ============================================
    // TEST 11: TRANSFER — Happy path
    // ============================================
    function test_Transfer_Success() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        token.transfer(bob, 100e18);

        assertEq(token.balanceOf(karim), 900e18, "Karim must have 900");
        assertEq(token.balanceOf(bob), 2100e18, "Bob must have 2100");
    }

    // ============================================
    // TEST 12: TRANSFER — To unverified reverts
    // ============================================
    function test_Transfer_UnverifiedTo() public {
        _mintToKarimAndBob();
        address stranger = makeAddr("stranger");

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                stranger
            )
        );
        token.transfer(stranger, 100e18);
    }

    // ============================================
    // TEST 13: TRANSFER — Self-transfer reverts
    // ============================================
    function test_Transfer_SelfTransfer() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        vm.expectRevert(DubaiRealEstateToken.DREIT__SelfTransfer.selector);
        token.transfer(karim, 100e18);
    }

    // ============================================
    // TEST 14: TRANSFER — From frozen account reverts
    // ============================================
    function test_Transfer_FromFrozen() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "suspicious_activity");

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                karim
            )
        );
        token.transfer(bob, 100e18);
    }

    // ============================================
    // TEST 15: FREEZE / UNFREEZE — Regulator can freeze and unfreeze via compliance
    // ============================================
    function test_FreezeUnfreeze() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "suspicious_activity");
        assertTrue(compliance.isFrozen(karim), "Karim must be frozen");

        vm.prank(regulator);
        compliance.unfreezeInvestor(karim);
        assertFalse(compliance.isFrozen(karim), "Karim must be unfrozen");

        // Transfer works again
        vm.prank(karim);
        token.transfer(bob, 100e18);
        assertEq(token.balanceOf(karim), 900e18);
    }

    // ============================================
    // TEST 16: DIVIDENDS — Distribute and claim
    // ============================================
    function test_Dividends_DistributeAndClaim() public {
        _mintToKarimAndBob();

        // Distribute 10,000 USDC (1000 + 2000 = 3000 tokens total)
        _distributeDividends(10_000 * 1e6);

        // Karim (1000/3000) should claim ~3333.33 USDC
        uint256 karimClaimable = token.getClaimableDividends(karim);
        assertGt(karimClaimable, 0, "Karim must have claimable dividends");

        uint256 karimUSDCBefore = usdc.balanceOf(karim);

        vm.prank(karim);
        token.claimDividends();

        uint256 karimUSDCAfter = usdc.balanceOf(karim);
        assertEq(karimUSDCAfter - karimUSDCBefore, karimClaimable, "Karim must receive claimable amount");
        assertEq(token.getClaimableDividends(karim), 0, "After claim = 0");
    }

    // ============================================
    // TEST 19: DIVIDENDS — Claim with nothing reverts
    // ============================================
    function test_Dividends_ClaimNothing() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        vm.expectRevert(DubaiRealEstateToken.DREIT__NoDividendsToClaim.selector);
        token.claimDividends();
    }

    // ============================================
    // TEST 20: DIVIDENDS — Anti-retroactivity for transfer recipient
    // ============================================
    function test_Dividends_AntiRetroactivity_Transfer() public {
        _mintToKarimAndBob();

        // Distribute dividends
        _distributeDividends(10_000 * 1e6);

        // New investor Ali registered
        address ali = makeAddr("ali");
        vm.prank(admin);
        registry.registerIdentity(ali, address(mockIdentity), COUNTRY_UAE);

        // Transfer from Karim to Ali
        vm.prank(karim);
        token.transfer(ali, 100e18);

        // Ali should NOT claim past dividends
        assertEq(token.getClaimableDividends(ali), 0, "Transfer recipient must have 0 retroactive");
    }

    // ============================================
    // TEST 21: DIVIDENDS — Only issuer can distribute
    // ============================================
    function test_Dividends_DistributeByNonIssuer() public {
        _mintToKarimAndBob();
        bytes32 issuerRole = token.ISSUER_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                issuerRole
            )
        );
        token.distributeDividends(10_000 * 1e6);
    }

    // ============================================
    // TEST 22: BURN — Happy path with dividends
    // ============================================
    function test_Burn_Success() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        uint256 claimableBefore = token.getClaimableDividends(karim);
        assertGt(claimableBefore, 0);

        uint256 usdcBefore = usdc.balanceOf(karim);

        vm.prank(karim);
        token.burn(500e18);

        assertEq(token.balanceOf(karim), 500e18, "Karim must have 500 left");
        assertEq(usdc.balanceOf(karim) - usdcBefore, claimableBefore, "Dividends paid before burn");
    }

    // ============================================
    // TEST 23: BURN — Zero amount reverts
    // ============================================
    function test_Burn_ZeroAmount() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.burn(0);
    }

    // ============================================
    // TEST 24: FORCED TRANSFER — Regulator can force transfer
    // ============================================
    function test_ForcedTransfer_Success() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        token.forcedTransfer(karim, bob, 100e18, "sanctions");

        assertEq(token.balanceOf(karim), 900e18, "Karim must have 900");
        assertEq(token.balanceOf(bob), 2100e18, "Bob must have 2100");
    }

    // ============================================
    // TEST 25: FORCED TRANSFER — Emits ForcedTransfer event
    // ============================================
    function test_ForcedTransfer_EmitsEvent() public {
        _mintToKarimAndBob();

        vm.expectEmit(true, true, false, true);
        emit ForcedTransfer(karim, bob, 100e18, "sanctions", regulator);

        vm.prank(regulator);
        token.forcedTransfer(karim, bob, 100e18, "sanctions");
    }

    // ============================================
    // TEST 26: FORCED TRANSFER — Non-regulator reverts
    // ============================================
    function test_ForcedTransfer_ByNonRegulator() public {
        _mintToKarimAndBob();
        bytes32 regRole = token.REGULATOR_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                regRole
            )
        );
        token.forcedTransfer(karim, bob, 100e18, "test");
    }

    // ============================================
    // TEST 27: FORCED BURN — Regulator can force burn
    // ============================================
    function test_ForcedBurn_Success() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        uint256 claimableBefore = token.getClaimableDividends(karim);
        uint256 usdcBefore = usdc.balanceOf(karim);

        vm.prank(regulator);
        token.forcedBurn(karim, 500e18, "sanctions");

        assertEq(token.balanceOf(karim), 500e18, "Karim must have 500 left");
        assertEq(usdc.balanceOf(karim) - usdcBefore, claimableBefore, "Dividends paid before forced burn");
    }

    // ============================================
    // TEST 28: PAUSABLE — Transfer reverts when paused
    // ============================================
    function test_Transfer_WhenPaused() public {
        _mintToKarimAndBob();

        vm.prank(admin);
        token.pause();

        vm.prank(karim);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        token.transfer(bob, 100e18);
    }

    // ============================================
    // TEST 29: PAUSABLE — Mint reverts when paused
    // ============================================
    function test_Mint_WhenPaused() public {
        vm.prank(admin);
        token.pause();

        vm.prank(issuer);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        token.mint(karim, INITIAL_MINT);
    }

    // ============================================
    // TEST 30: PAUSABLE — Unpause restores transfers
    // ============================================
    function test_Unpause_RestoresTransfers() public {
        _mintToKarimAndBob();

        vm.prank(admin);
        token.pause();

        vm.prank(admin);
        token.unpause();

        vm.prank(karim);
        token.transfer(bob, 100e18);
        assertEq(token.balanceOf(karim), 900e18);
    }

    // ============================================
    // TEST 31: BATCH MINT — Mint multiple at once
    // ============================================
    function test_BatchMint_Success() public {
        address[] memory recipients = new address[](2);
        recipients[0] = karim;
        recipients[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 500e18;
        amounts[1] = 700e18;

        vm.prank(issuer);
        token.batchMint(recipients, amounts);

        assertEq(token.balanceOf(karim), 500e18);
        assertEq(token.balanceOf(bob), 700e18);
        assertEq(token.totalSupply(), 1200e18);
    }

    // ============================================
    // TEST 32: BATCH MINT — Array length mismatch reverts
    // ============================================
    function test_BatchMint_ArrayMismatch() public {
        address[] memory recipients = new address[](2);
        recipients[0] = karim;
        recipients[1] = bob;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500e18;

        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__ArrayLengthMismatch.selector);
        token.batchMint(recipients, amounts);
    }

    // ============================================
    // TEST 33: SWEEP DUST — Admin can sweep dust
    // ============================================
    function test_SweepDust() public {
        _mintToKarimAndBob();

        // Distribute an amount that creates dust
        // 10_001 USDC (6 decimals) / 3000 tokens = 3.333... per token → dust exists
        _distributeDividends(10_001 * 1e6);

        uint256 dust = token.dust();
        assertGt(dust, 0, "Dust must be > 0");

        uint256 adminUSDCBefore = usdc.balanceOf(admin);

        vm.prank(admin);
        token.sweepDust();

        assertEq(token.dust(), 0, "Dust must be 0 after sweep");
        assertEq(usdc.balanceOf(admin) - adminUSDCBefore, dust, "Admin must receive dust");
    }

    // ============================================
    // TEST 34: SWEEP DUST — Non-admin reverts
    // ============================================
    function test_SweepDust_ByNonAdmin() public {
        bytes32 adminRole = token.DEFAULT_ADMIN_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        token.sweepDust();
    }

    // ============================================
    // TEST 35: SET REGISTRY — Admin can update registry
    // ============================================
    function test_SetIdentityRegistry_ByAdmin() public {
        address newRegistry = address(new IdentityRegistry(admin));

        vm.prank(admin);
        token.setIdentityRegistry(newRegistry);

        assertEq(address(token.identityRegistry()), newRegistry);
    }

    // ============================================
    // TEST 36: SET REGISTRY — Zero address reverts
    // ============================================
    function test_SetIdentityRegistry_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        token.setIdentityRegistry(address(0));
    }

    // ============================================
    // TEST 37: TRANSFERFROM — Happy path
    // ============================================
    function test_TransferFrom_Success() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        token.approve(bob, 100e18);

        vm.prank(bob);
        token.transferFrom(karim, bob, 100e18);

        assertEq(token.balanceOf(karim), 900e18, "Karim must have 900");
        assertEq(token.balanceOf(bob), 2100e18, "Bob must have 2100");
    }

    // ============================================
    // TEST 38: TRANSFERFROM — To unverified reverts
    // ============================================
    function test_TransferFrom_UnverifiedTo() public {
        _mintToKarimAndBob();
        address stranger = makeAddr("stranger");

        vm.prank(karim);
        token.approve(bob, 100e18);

        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                stranger
            )
        );
        token.transferFrom(karim, stranger, 100e18);
    }

    // ============================================
    // TEST 39: TRANSFERFROM — From frozen reverts
    // ============================================
    function test_TransferFrom_FromFrozen() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "test");

        vm.prank(karim);
        token.approve(bob, 100e18);

        vm.prank(bob);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                karim
            )
        );
        token.transferFrom(karim, bob, 100e18);
    }

    // ============================================
    // TEST 40: SET COMPLIANCE ENGINE — Non-admin reverts
    // ============================================
    function test_SetComplianceEngine_ByNonAdmin() public {
        bytes32 adminRole = token.DEFAULT_ADMIN_ROLE();
        address newEngine = address(new ComplianceEngine(admin, address(registry)));

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                adminRole
            )
        );
        token.setComplianceEngine(newEngine);
    }

    // ============================================
    // TEST 41: DIVIDENDS — Distribute when paused reverts
    // ============================================
    function test_Dividends_DistributeWhenPaused() public {
        _mintToKarimAndBob();

        vm.prank(admin);
        token.pause();

        vm.prank(issuer);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        token.distributeDividends(10_000 * 1e6);
    }

    // ============================================
    // TEST 42: FORCED TRANSFER — To unverified reverts
    // ============================================
    function test_ForcedTransfer_ToUnverified() public {
        _mintToKarimAndBob();
        address stranger = makeAddr("stranger");

        vm.prank(regulator);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                stranger
            )
        );
        token.forcedTransfer(karim, stranger, 100e18, "test");
    }

    // ============================================
    // TEST 43: BURN — From frozen reverts
    // ============================================
    function test_Burn_FromFrozen() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "test");

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                karim
            )
        );
        token.burn(100e18);
    }

    // ============================================
    // TEST 44: BURN — Exceeds balance reverts (ERC20InsufficientBalance from OZ)
    // ============================================
    function test_Burn_ExceedsBalance() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        vm.expectRevert(); // ERC20InsufficientBalance from OpenZeppelin
        token.burn(2000e18); // Karim only has 1000
    }

    // ============================================
    // TEST 45: BURN — From unverified reverts
    // ============================================
    function test_Burn_FromUnverified() public {
        address stranger = makeAddr("stranger");
        MockIdentity strangerId = new MockIdentity();

        // KYC stranger with short expiry so we can mint, then expire
        vm.prank(admin);
        registry.registerIdentity(stranger, address(strangerId), 1, IIdentityRegistry.InvestorType.Retail, block.timestamp + 1);

        vm.prank(issuer);
        token.mint(stranger, 100e18);

        // Warp past expiry so stranger becomes unverified
        vm.warp(block.timestamp + 2);

        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                stranger
            )
        );
        token.burn(50e18);
    }

    // ============================================
    // TEST 46: BURN — When paused reverts
    // ============================================
    function test_Burn_WhenPaused() public {
        _mintToKarimAndBob();

        vm.prank(admin);
        token.pause();

        vm.prank(karim);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        token.burn(100e18);
    }

    // ============================================
    // TEST 47: FORCED BURN — Non-regulator reverts
    // ============================================
    function test_ForcedBurn_ByNonRegulator() public {
        _mintToKarimAndBob();
        bytes32 regRole = token.REGULATOR_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                hacker,
                regRole
            )
        );
        token.forcedBurn(karim, 100e18, "test");
    }

    // ============================================
    // TEST 48: TRANSFERFROM — Exceeds allowance reverts
    // ============================================
    function test_TransferFrom_ExceedsAllowance() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        token.approve(bob, 50e18);

        vm.prank(bob);
        vm.expectRevert();
        token.transferFrom(karim, bob, 100e18); // 100 > 50 allowance
    }

    // ============================================
    // TEST 49: TRANSFERFROM — Self-transfer reverts
    // ============================================
    function test_TransferFrom_SelfTransfer() public {
        _mintToKarimAndBob();

        vm.prank(karim);
        token.approve(bob, 100e18);

        vm.prank(bob);
        vm.expectRevert(DubaiRealEstateToken.DREIT__SelfTransfer.selector);
        token.transferFrom(karim, karim, 100e18);
    }

    // ============================================
    // TESTS CONSTRUCTOR — 8 branches manquantes
    // ============================================
    function test_Constructor_ZeroAddressStablecoin() public {
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        new DubaiRealEstateToken(address(0), address(registry), address(compliance), "DREIT", "DREIT", admin);
    }

    function test_Constructor_ZeroAddressRegistry() public {
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        new DubaiRealEstateToken(address(usdc), address(0), address(compliance), "DREIT", "DREIT", admin);
    }

    function test_Constructor_ZeroAddressEngine() public {
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        new DubaiRealEstateToken(address(usdc), address(registry), address(0), "DREIT", "DREIT", admin);
    }

    function test_Constructor_ZeroAddressAdmin() public {
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        new DubaiRealEstateToken(address(usdc), address(registry), address(compliance), "DREIT", "DREIT", address(0));
    }

    function test_Constructor_EOAStablecoin() public {
        address eoa = makeAddr("eoa");
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__NotContract.selector, eoa));
        new DubaiRealEstateToken(eoa, address(registry), address(compliance), "DREIT", "DREIT", admin);
    }

    function test_Constructor_EOARegistry() public {
        address eoa = makeAddr("eoa");
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__NotContract.selector, eoa));
        new DubaiRealEstateToken(address(usdc), eoa, address(compliance), "DREIT", "DREIT", admin);
    }

    function test_Constructor_EOAEngine() public {
        address eoa = makeAddr("eoa");
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__NotContract.selector, eoa));
        new DubaiRealEstateToken(address(usdc), address(registry), eoa, "DREIT", "DREIT", admin);
    }

    // ============================================
    // TESTS MINT — Zero address reverts (1 branche)
    // ============================================
    function test_Mint_ZeroAddress() public {
        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        token.mint(address(0), 100e18);
    }

    // ============================================
    // TESTS MINT — Compliance rejects (1 branche)
    // ============================================
    function test_Mint_ComplianceRejects() public {
        // Restrict France (Bob's country)
        vm.prank(admin);
        compliance.restrictCountry(COUNTRY_FRANCE);

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__TransferNotCompliant.selector,
                address(0),
                bob
            )
        );
        token.mint(bob, 100e18);
    }

    // ============================================
    // TESTS BATCH MINT — Syncs dividends (1 branche)
    // ============================================
    function test_BatchMint_SyncsDividends() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        // Bob already has 2000 tokens and claimable dividends
        uint256 bobClaimableBefore = token.getClaimableDividends(bob);
        assertGt(bobClaimableBefore, 0);

        address[] memory recipients = new address[](1);
        recipients[0] = bob;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100e18;

        vm.prank(issuer);
        token.batchMint(recipients, amounts);

        // Bob's claimable should still include previous dividends
        assertGe(token.getClaimableDividends(bob), bobClaimableBefore);
    }

    // ============================================
    // TESTS SET COMPLIANCE ENGINE — Zero address (1 branche)
    // ============================================
    function test_SetComplianceEngine_ZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        token.setComplianceEngine(address(0));
    }

    // ============================================
    // TESTS SET IDENTITY REGISTRY — EOA (1 branche)
    // ============================================
    function test_SetIdentityRegistry_EOA() public {
        address eoa = makeAddr("eoa");
        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(DubaiRealEstateToken.DREIT__NotContract.selector, eoa)
        );
        token.setIdentityRegistry(eoa);
    }

    // ============================================
    // TESTS DISTRIBUTE DIVIDENDS — 3 branches
    // ============================================
    function test_DistributeDividends_ZeroAmount() public {
        _mintToKarimAndBob();
        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.distributeDividends(0);
    }

    function test_DistributeDividends_NoSupply() public {
        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.distributeDividends(100 * 1e6);
    }

    function test_DistributeDividends_TooSmall() public {
        _mintToKarimAndBob();
        // 3000 tokens, distribute 1 wei USDC → dividendPerToken = 0
        vm.startPrank(issuer);
        usdc.approve(address(token), 1);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.distributeDividends(1);
        vm.stopPrank();
    }

    // ============================================
    // TESTS SWEEP DUST — 1 branche
    // ============================================
    function test_SweepDust_NoDust() public {
        vm.prank(admin);
        vm.expectRevert(DubaiRealEstateToken.DREIT__NoDividendsToClaim.selector);
        token.sweepDust();
    }

    // ============================================
    // TESTS FORCED TRANSFER — 3 branches
    // ============================================
    function test_ForcedTransfer_ZeroAmount() public {
        _mintToKarimAndBob();
        vm.prank(regulator);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.forcedTransfer(karim, bob, 0, "test");
    }

    function test_ForcedTransfer_ExceedsBalance() public {
        _mintToKarimAndBob();
        vm.prank(regulator);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InsufficientBalance.selector);
        token.forcedTransfer(karim, bob, 2000e18, "test");
    }

    function test_ForcedTransfer_ComplianceRejects() public {
        _mintToKarimAndBob();
        // Restrict France (Bob's country) so KYC passes but compliance fails
        vm.prank(admin);
        compliance.restrictCountry(COUNTRY_FRANCE);

        vm.prank(regulator);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__TransferNotCompliant.selector,
                karim,
                bob
            )
        );
        token.forcedTransfer(karim, bob, 100e18, "test");
    }

    // ============================================
    // TESTS FORCED BURN — 2 branches
    // ============================================
    function test_ForcedBurn_ZeroAmount() public {
        _mintToKarimAndBob();
        vm.prank(regulator);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InvalidAmount.selector);
        token.forcedBurn(karim, 0, "test");
    }

    function test_ForcedBurn_ExceedsBalance() public {
        _mintToKarimAndBob();
        vm.prank(regulator);
        vm.expectRevert(DubaiRealEstateToken.DREIT__InsufficientBalance.selector);
        token.forcedBurn(karim, 2000e18, "test");
    }

    // ============================================
    // TESTS BATCH MINT — 5 branches
    // ============================================
    function test_BatchMint_ExceedsMaxSupply() public {
        address[] memory recipients = new address[](1);
        recipients[0] = karim;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100_000e18; // > MAX_SUPPLY

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__MaxSupplyExceeded.selector,
                100_000e18,
                50_000e18
            )
        );
        token.batchMint(recipients, amounts);
    }

    function test_BatchMint_ZeroAddress() public {
        address[] memory recipients = new address[](1);
        recipients[0] = address(0);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100e18;

        vm.prank(issuer);
        vm.expectRevert(DubaiRealEstateToken.DREIT__ZeroAddress.selector);
        token.batchMint(recipients, amounts);
    }

    function test_BatchMint_AmountZero() public {
        _mintToKarimAndBob(); // pour avoir totalSupply > 0
        address[] memory recipients = new address[](1);
        recipients[0] = karim;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;

        vm.prank(issuer);
        token.batchMint(recipients, amounts); // amount=0 → continue, ne revert pas
        // supply inchangé
        assertEq(token.totalSupply(), 3000e18);
    }

    function test_BatchMint_ComplianceRejects() public {
        _mintToKarimAndBob();
        address ali = makeAddr("ali");
        vm.prank(admin);
        registry.registerIdentity(ali, address(mockIdentity), COUNTRY_UAE);

        // Restrict UAE
        vm.prank(admin);
        compliance.restrictCountry(COUNTRY_UAE);

        address[] memory recipients = new address[](1);
        recipients[0] = ali;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100e18;

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__TransferNotCompliant.selector,
                address(0),
                ali
            )
        );
        token.batchMint(recipients, amounts);
    }

    // ============================================
    // TESTS TRANSFER COMPLIANCE REJECTS — 1 branche
    // ============================================
    function test_Transfer_ComplianceRejects() public {
        _mintToKarimAndBob();
        // Restrict UAE so KYC passes but compliance fails
        vm.prank(admin);
        compliance.restrictCountry(COUNTRY_UAE);

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__TransferNotCompliant.selector,
                karim,
                bob
            )
        );
        token.transfer(bob, 100e18);
    }

    // ============================================
    // TESTS TRANSFER KYC EXPIRED — 1 branche
    // ============================================
    function test_Transfer_KYCExpired() public {
        _mintToKarimAndBob();
        // Expire Karim's KYC
        vm.warp(block.timestamp + 2 * 365 days);

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__KYCNotVerified.selector,
                karim
            )
        );
        token.transfer(bob, 100e18);
    }

    // ============================================
    // TESTS TRANSFER TO CONTRACT — 1 branche
    // ============================================
    function test_Transfer_ToContract() public {
        _mintToKarimAndBob();
        vm.prank(karim);
        vm.expectRevert(DubaiRealEstateToken.DREIT__SelfTransfer.selector);
        token.transfer(address(token), 100e18);
    }

    // ============================================
    // TESTS GET CLAIMABLE DIVIDENDS — 1 branche
    // ============================================
    function test_GetClaimableDividends_ZeroBalance() public {
        address stranger = makeAddr("stranger");
        // No tokens, no dividends
        assertEq(token.getClaimableDividends(stranger), 0);
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function _mintToKarimAndBob() internal {
        vm.startPrank(issuer);
        token.mint(karim, INITIAL_MINT);
        token.mint(bob, 2 * INITIAL_MINT);
        vm.stopPrank();
    }

    function _distributeDividends(uint256 amount) internal {
        vm.startPrank(issuer);
        usdc.approve(address(token), amount);
        token.distributeDividends(amount);
        vm.stopPrank();
    }

    // ============================================
    // TEST 50: burn — without dividends (claimable == 0 path)
    // ============================================
    function test_Burn_NoDividends() public {
        _mintToKarimAndBob();
        // No dividends distributed

        uint256 usdcBefore = usdc.balanceOf(karim);

        vm.prank(karim);
        token.burn(100e18);

        assertEq(token.balanceOf(karim), 900e18);
        assertEq(usdc.balanceOf(karim), usdcBefore); // No USDC received
    }

    // ============================================
    // TEST 52: distributeDividends — exact amount creates zero dust
    // ============================================
    function test_DistributeDividends_ExactNoDust() public {
        _mintToKarimAndBob();
        // 3000 tokens, distribute exactly 3000 USDC → 1 USDC per token, no dust
        _distributeDividends(3000 * 1e6);
        assertEq(token.dust(), 0, "Exact distribution must create zero dust");
    }

    // ============================================
    // TEST 53: distributeDividends — redistributes existing dust
    // ============================================
    function test_DistributeDividends_RedistributesDust() public {
        _mintToKarimAndBob();

        // First distribution creates dust
        _distributeDividends(10_001 * 1e6);
        uint256 dustAfterFirst = token.dust();
        assertGt(dustAfterFirst, 0, "First distribution must create dust");

        uint256 dividendPerTokenBefore = token.dividendPerToken();

        // Second distribution: dust is auto-reinjected
        vm.startPrank(issuer);
        usdc.approve(address(token), 10_000 * 1e6);
        token.distributeDividends(10_000 * 1e6);
        vm.stopPrank();

        // dividendPerToken must increase (dust was reinjected)
        assertGt(token.dividendPerToken(), dividendPerTokenBefore);
    }

    // ============================================
    // TEST 54: forcedTransfer — to frozen account reverts
    // ============================================
    function test_ForcedTransfer_FrozenTo() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(bob, "sanctions");

        vm.prank(regulator);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                bob
            )
        );
        token.forcedTransfer(karim, bob, 100e18, "test");
    }

    // ============================================
    // TEST 55: claimDividends — when frozen reverts
    // ============================================
    function test_ClaimDividends_FrozenReverts() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "test");

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                karim
            )
        );
        token.claimDividends();
    }

    // ============================================
    // TEST 56: getClaimableDividends — delta == 0 returns pending only
    // ============================================
    function test_GetClaimableDividends_WithDeltaZero() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        vm.prank(karim);
        token.claimDividends();

        // After claim, lastClaimed == dividendPerToken, so delta == 0
        assertEq(token.getClaimableDividends(karim), 0, "Delta=0 must return only pending (0)");
    }

    // ============================================
    // TEST 57: _syncDividends — balance == 0 path
    // ============================================
    function test_SyncDividends_BalanceZero() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        // Karim transfers everything to Bob, balance becomes 0
        vm.prank(karim);
        token.transfer(bob, 1000e18);
        assertEq(token.balanceOf(karim), 0);

        uint256 usdcBefore = usdc.balanceOf(karim);

        // Karim can still claim his pending dividends even with 0 balance
        vm.prank(karim);
        token.claimDividends();

        assertGt(usdc.balanceOf(karim) - usdcBefore, 0, "Must claim pending dividends with 0 balance");
    }

    // ============================================
    // TEST 58: transfer — to frozen account reverts
    // ============================================
    function test_Transfer_ToFrozen() public {
        _mintToKarimAndBob();

        vm.prank(regulator);
        compliance.freezeInvestor(bob, "sanctions");

        vm.prank(karim);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                bob
            )
        );
        token.transfer(bob, 100e18);
    }

    // ============================================
    // TEST 59: setComplianceEngine — EOA reverts
    // ============================================
    function test_SetComplianceEngine_EOA() public {
        address eoa = makeAddr("eoa");
        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(DubaiRealEstateToken.DREIT__NotContract.selector, eoa)
        );
        token.setComplianceEngine(eoa);
    }

    // ============================================
    // TEST 60: claimDividends — delta == 0 in _syncDividends
    // ============================================
    function test_ClaimDividends_DeltaZero() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        vm.prank(karim);
        token.claimDividends(); // First claim syncs and pays

        // Second claim: _syncDividends sees delta == 0, then claimable == 0 → revert
        vm.prank(karim);
        vm.expectRevert(DubaiRealEstateToken.DREIT__NoDividendsToClaim.selector);
        token.claimDividends();
    }

    // ============================================
    // TEST 61: batchMint — frozen recipient reverts
    // ============================================
    function test_BatchMint_FrozenRecipient() public {
        vm.prank(regulator);
        compliance.freezeInvestor(karim, "sanctions");

        address[] memory recipients = new address[](1);
        recipients[0] = karim;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100e18;

        vm.prank(issuer);
        vm.expectRevert(
            abi.encodeWithSelector(
                DubaiRealEstateToken.DREIT__AccountFrozen.selector,
                karim
            )
        );
        token.batchMint(recipients, amounts);
    }

    // ============================================
    // TEST 62: _syncDividends — unclaimed == 0 path (tiny balance)
    // ============================================
    function test_SyncDividends_UnclaimedZero() public {
        address ali = makeAddr("ali");
        vm.prank(admin);
        registry.registerIdentity(ali, address(mockIdentity), COUNTRY_UAE);

        // Mint 1 wei to Karim and (1e18 - 1) to Ali so totalSupply = 1e18
        vm.startPrank(issuer);
        token.mint(karim, 1);
        token.mint(ali, 1e18 - 1);
        vm.stopPrank();

        // Distribute 1 wei USDC → newDividendPerToken = (1 * 1e18) / 1e18 = 1
        vm.startPrank(issuer);
        usdc.approve(address(token), 1);
        token.distributeDividends(1);
        vm.stopPrank();

        // Karim transfers his 1 wei to Ali
        // _syncDividends(Karim) with balance=1, delta=1 → unclaimed = (1*1)/1e18 = 0
        vm.prank(karim);
        token.transfer(ali, 1);

        // No DividendSynced event should have been emitted for Karim (unclaimed was 0)
        assertEq(token.getClaimableDividends(karim), 0);
    }

    // ============================================
    // WORKAROUND: cover defensive branches via try/catch (forge coverage bug with reverts)
    // ============================================
    function test_NonZeroAddress_CoverageWorkaround() public {
        vm.prank(admin);
        try token.setComplianceEngine(address(0)) {
            assertTrue(false, "Should revert");
        } catch {
            // branch covered
        }
    }

    function test_NotFrozen_CoverageWorkaround() public {
        _mintToKarimAndBob();
        _distributeDividends(10_000 * 1e6);

        vm.prank(regulator);
        compliance.freezeInvestor(karim, "test");

        vm.prank(karim);
        try token.claimDividends() {
            assertTrue(false, "Should revert");
        } catch {
            // branch covered
        }
    }

}