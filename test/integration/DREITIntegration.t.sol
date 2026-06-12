// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../../src/core/DubaiRealEstateToken.sol";
import "../../src/compliance/IdentityRegistry.sol";
import "../../src/compliance/ComplianceEngine.sol";
import "../../src/interfaces/IIdentityRegistry.sol";
import "../../test/mocks/MockUSDC.sol";

/**
 * @title DREITIntegrationTest
 * @notice End-to-end happy path: KYC → mint → transfer → distribute → claim.
 * @dev This test proves the full lifecycle of a DREIT token holder.
 */
contract DREITIntegrationTest is Test {
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;

    address public admin;
    address public issuer;
    address public regulator;
    address public agent;
    address public alice;
    address public bob;

    uint16 constant COUNTRY_UAE = 784;
    uint256 constant INITIAL_BALANCE = 1_000_000e6; // 1M USDC

    function setUp() public {
        admin = makeAddr("admin");
        issuer = makeAddr("issuer");
        regulator = makeAddr("regulator");
        agent = makeAddr("agent");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        vm.startPrank(admin);
        usdc = new MockUSDC();
        registry = new IdentityRegistry(admin);
        compliance = new ComplianceEngine(admin, address(registry));
        token = new DubaiRealEstateToken(
            address(usdc), address(registry), address(compliance), "Dubai Real Estate", "DREIT", admin
        );
        compliance.bindToken(address(token));

        token.grantRole(token.ISSUER_ROLE(), issuer);
        token.grantRole(token.REGULATOR_ROLE(), regulator);
        registry.grantRole(registry.ISSUER_ROLE(), issuer);

        // Fund with USDC
        usdc.mint(admin, INITIAL_BALANCE);
        usdc.approve(address(token), INITIAL_BALANCE);
        vm.stopPrank();
    }

    function _registerKYC(address investor) internal {
        address mockIdentity = address(new MockIdentity());
        vm.prank(issuer);
        registry.registerIdentity(
            investor, mockIdentity, COUNTRY_UAE, IIdentityRegistry.InvestorType.Retail, block.timestamp + 365 days
        );
    }

    // ============================================
    // HAPPY PATH
    // ============================================

    function test_HappyPath_FullLifecycle() public {
        // 1. KYC both investors
        _registerKYC(alice);
        _registerKYC(bob);
        assertTrue(registry.isVerified(alice));
        assertTrue(registry.isVerified(bob));

        // 2. Issuer mints tokens
        uint256 aliceMint = 1000e18;
        uint256 bobMint = 500e18;

        vm.startPrank(issuer);
        token.mint(alice, aliceMint);
        token.mint(bob, bobMint);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), aliceMint);
        assertEq(token.balanceOf(bob), bobMint);
        assertEq(token.totalSupply(), aliceMint + bobMint);

        // 3. Alice transfers to Bob
        uint256 transferAmount = 200e18;
        vm.prank(alice);
        token.transfer(bob, transferAmount);

        assertEq(token.balanceOf(alice), aliceMint - transferAmount);
        assertEq(token.balanceOf(bob), bobMint + transferAmount);

        // 4. Admin distributes dividends
        uint256 dividendAmount = 1500e6; // 1500 USDC
        vm.prank(admin);
        token.distributeDividends(dividendAmount);

        uint256 expectedPerToken = (dividendAmount * 1e18) / token.totalSupply();
        assertEq(token.dividendPerToken(), expectedPerToken);

        // 5. Both claim dividends
        uint256 aliceClaimable = token.getClaimableDividends(alice);
        uint256 bobClaimable = token.getClaimableDividends(bob);

        assertGt(aliceClaimable, 0);
        assertGt(bobClaimable, 0);

        vm.prank(alice);
        token.claimDividends();

        vm.prank(bob);
        token.claimDividends();

        assertEq(token.getClaimableDividends(alice), 0);
        assertEq(token.getClaimableDividends(bob), 0);
        assertEq(usdc.balanceOf(alice), aliceClaimable);
        assertEq(usdc.balanceOf(bob), bobClaimable);
    }

    // ============================================
    // FORCED TRANSFER + DIVIDEND SYNC
    // ============================================

    function test_ForcedTransfer_SyncsDividends() public {
        _registerKYC(alice);
        _registerKYC(bob);

        vm.prank(issuer);
        token.mint(alice, 1000e18);

        // Distribute dividends while Alice holds
        uint256 dividendAmount = 1000e6;
        vm.prank(admin);
        token.distributeDividends(dividendAmount);

        uint256 aliceClaimableBefore = token.getClaimableDividends(alice);
        assertGt(aliceClaimableBefore, 0);

        // Regulator forces transfer to Bob
        vm.prank(regulator);
        token.forcedTransfer(alice, bob, 500e18, "sanctions");

        // Alice should still be able to claim her pre-transfer dividends
        vm.prank(alice);
        token.claimDividends();
        assertEq(token.getClaimableDividends(alice), 0);

        // Bob should have 0 claimable (he just received tokens, no prior dividends)
        assertEq(token.getClaimableDividends(bob), 0);

        // Bob should be able to receive future dividends
        vm.prank(admin);
        token.distributeDividends(1000e6);

        uint256 bobClaimable = token.getClaimableDividends(bob);
        assertGt(bobClaimable, 0);
    }

    // ============================================
    // BATCH MINT + DIVIDEND SYNC
    // ============================================

    function test_BatchMint_SyncsDividends() public {
        _registerKYC(alice);
        _registerKYC(bob);

        vm.prank(issuer);
        token.mint(alice, 1000e18);

        // Distribute dividends
        vm.prank(admin);
        token.distributeDividends(1000e6);

        // Batch mint to Bob — Bob should start at current dividendPerToken
        address[] memory recipients = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        recipients[0] = bob;
        amounts[0] = 500e18;

        vm.prank(issuer);
        token.batchMint(recipients, amounts);

        // Bob should have 0 claimable from past dividends
        assertEq(token.getClaimableDividends(bob), 0);

        // Future dividends should work
        vm.prank(admin);
        token.distributeDividends(1000e6);

        assertGt(token.getClaimableDividends(bob), 0);
    }
}

contract MockIdentity {
    // Intentionally empty — satisfies extcodesize check.
}
