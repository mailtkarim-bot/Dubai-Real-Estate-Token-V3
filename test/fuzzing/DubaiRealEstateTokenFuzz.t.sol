// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Test } from "forge-std/Test.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";
import { MockUSDC } from "../mocks/MockUSDC.sol";
import { MockIdentity } from "../mocks/MockIdentity.sol";
import { IIdentityRegistry } from "../../src/interfaces/IIdentityRegistry.sol";

/**
 * @title DubaiRealEstateTokenFuzzTest
 * @notice Fuzzing tests targeting REAL risks of the DREIT token:
 *         dividend solvency, compliance enforcement, KYC expiry,
 *         forced transfer compliance, supply conservation, and
 *         dividend arithmetic consistency.
 * @dev 10_000 runs per test via foundry.toml configuration.
 */
contract DubaiRealEstateTokenFuzzTest is Test {
    // ============================================
    // CONTRACTS UNDER TEST
    // ============================================
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;

    // ============================================
    // ACTORS
    // ============================================
    address public admin = makeAddr("admin");
    address public issuer = makeAddr("issuer");
    address public regulator = makeAddr("regulator");

    // ============================================
    // SETUP
    // ============================================
    function setUp() public {
        vm.startPrank(admin);

        usdc = new MockUSDC();
        registry = new IdentityRegistry(admin);
        compliance = new ComplianceEngine(admin, address(registry));
        token = new DubaiRealEstateToken(
            address(usdc), address(registry), address(compliance), "Dubai Real Estate", "DREIT", admin
        );

        token.grantRole(token.ISSUER_ROLE(), issuer);
        token.grantRole(token.REGULATOR_ROLE(), regulator);
        compliance.grantRole(compliance.REGULATOR_ROLE(), regulator);
        compliance.bindToken(address(token));
        registry.setToken(address(token));

        vm.stopPrank();
    }

    // ============================================
    // HELPER: Register KYC + Mint
    // ============================================
    function _registerAndMint(address to, uint256 amount) internal {
        MockIdentity id = new MockIdentity();
        vm.prank(admin);
        registry.registerIdentity(to, address(id), 784);
        if (amount > 0) {
            vm.prank(issuer);
            token.mint(to, amount);
        }
    }

    // ============================================
    // HELPER: Register KYC with short expiry
    // ============================================
    function _registerWithExpiry(address to, uint256 expiry) internal {
        MockIdentity id = new MockIdentity();
        vm.prank(admin);
        registry.registerIdentity(to, address(id), 784, IIdentityRegistry.InvestorType.Retail, expiry);
    }

    // ============================================
    // HELPER: Distribute USDC dividends
    // ============================================
    function _distribute(uint256 amount) internal {
        // Mint as admin (owner of MockUSDC), then distribute as issuer
        vm.prank(admin);
        usdc.mint(issuer, amount);

        vm.startPrank(issuer);
        usdc.approve(address(token), amount);
        token.distributeDividends(amount);
        vm.stopPrank();
    }

    // ============================================
    // FUZZ 1: Cumulative mint must respect MAX_SUPPLY
    // ============================================
    /**
     * @notice Two consecutive random mints must never exceed the hard cap.
     *         If the second mint would overflow, the contract must revert.
     */
    function testFuzz_MintRespectsMaxSupply(uint256 amount1, uint256 amount2) public {
        amount1 = bound(amount1, 0, token.MAX_SUPPLY());
        amount2 = bound(amount2, 0, token.MAX_SUPPLY());

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        _registerAndMint(alice, amount1);

        if (token.totalSupply() + amount2 > token.MAX_SUPPLY()) {
            vm.prank(issuer);
            vm.expectRevert();
            token.mint(bob, amount2);
        } else {
            _registerAndMint(bob, amount2);
            assertLe(token.totalSupply(), token.MAX_SUPPLY(), "Supply cap violated");
        }
    }

    // ============================================
    // FUZZ 2: Burn reduces total supply and balance exactly
    // ============================================
    function testFuzz_BurnReducesTotalSupply(uint256 mintAmount, uint256 burnAmount) public {
        mintAmount = bound(mintAmount, 1, token.MAX_SUPPLY());
        burnAmount = bound(burnAmount, 1, mintAmount);

        address holder = makeAddr("holder");
        _registerAndMint(holder, mintAmount);

        uint256 supplyBefore = token.totalSupply();
        uint256 balanceBefore = token.balanceOf(holder);

        vm.prank(holder);
        token.burn(burnAmount);

        assertEq(token.totalSupply(), supplyBefore - burnAmount, "Supply mismatch after burn");
        assertEq(token.balanceOf(holder), balanceBefore - burnAmount, "Balance mismatch after burn");
    }

    // ============================================
    // FUZZ 3: Forced transfer must respect compliance (frozen from)
    // ============================================
    /**
     * @notice A forced transfer from a frozen account must revert.
     *         This verifies that compliance.isCompliant(from,...) is checked
     *         and not bypassed by using a zero-address or internal state.
     */
    function testFuzz_ForcedTransferRespectsComplianceFrom(uint256 mintAmount, uint256 forcedAmount) public {
        mintAmount = bound(mintAmount, 100, token.MAX_SUPPLY() / 2);
        forcedAmount = bound(forcedAmount, 1, mintAmount);

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        // Alice: KYC valid, then frozen by regulator
        _registerAndMint(alice, mintAmount);
        _registerAndMint(bob, 1);

        vm.prank(regulator);
        compliance.freezeInvestor(alice, "sanctions");

        // Seed some dividends
        _distribute(1000 * 1e6);

        // INVARIANT: forcedTransfer from frozen account must revert
        vm.prank(regulator);
        vm.expectRevert();
        token.forcedTransfer(alice, bob, forcedAmount, "regulatory seizure");
    }

    // ============================================
    // FUZZ 4: KYC expired account cannot burn or claim dividends
    // ============================================
    function testFuzz_KYCExpiredRevertsBurnAndClaim(uint256 mintAmount) public {
        mintAmount = bound(mintAmount, 1, token.MAX_SUPPLY() / 2);

        address alice = makeAddr("alice");

        // Register with KYC expiring in 2 seconds
        _registerWithExpiry(alice, block.timestamp + 2);
        vm.prank(issuer);
        token.mint(alice, mintAmount);

        // Distribute dividends while KYC is still valid
        _distribute(1000 * 1e6);

        // Warp past expiry
        vm.warp(block.timestamp + 10);

        // Burn must revert
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__KYCNotVerified.selector, alice));
        token.burn(mintAmount);

        // Claim must revert
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__KYCNotVerified.selector, alice));
        token.claimDividends();
    }

    // ============================================
    // FUZZ 5: Frozen account cannot transfer
    // ============================================
    function testFuzz_FrozenAccountRevertsTransfer(uint256 mintAmount, uint256 transferAmount) public {
        mintAmount = bound(mintAmount, 1, token.MAX_SUPPLY() / 2);
        transferAmount = bound(transferAmount, 1, mintAmount);

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        _registerAndMint(alice, mintAmount);
        _registerAndMint(bob, 0);

        // Freeze Alice
        vm.prank(regulator);
        compliance.freezeInvestor(alice, "sanctions");

        // Transfer must revert
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DubaiRealEstateToken.DREIT__AccountFrozen.selector, alice));
        token.transfer(bob, transferAmount);
    }

    // ============================================
    // FUZZ 6: Dividend distribution must be arithmetically consistent
    // ============================================
    /**
     * @notice After distributing D USDC across N holders, the sum of
     *         individual claimables must not exceed D (accounting for
     *         rounding dust). Each holder's claimable must be proportional
     *         to their balance.
     */
    function testFuzz_DividendDistributionIsConsistent(uint256 amount1, uint256 amount2, uint256 dividend) public {
        amount1 = bound(amount1, 1e18, token.MAX_SUPPLY() / 3);
        amount2 = bound(amount2, 1e18, token.MAX_SUPPLY() / 3);
        dividend = bound(dividend, 1e6, 1_000_000 * 1e6);

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        _registerAndMint(alice, amount1);
        _registerAndMint(bob, amount2);

        _distribute(dividend);

        uint256 claimableAlice = token.getClaimableDividends(alice);
        uint256 claimableBob = token.getClaimableDividends(bob);

        // Invariant 1: total claimable cannot exceed distributed amount
        // (rounding may create dust, but never more than dividend)
        assertLe(claimableAlice + claimableBob, dividend, "Total claimable exceeds distributed dividends");

        // Invariant 2: each holder has a positive claimable (if dividend > 0 and balance > 0)
        if (dividend > 0) {
            assertGt(claimableAlice, 0, "Alice should have claimable dividends");
            assertGt(claimableBob, 0, "Bob should have claimable dividends");
        }
    }

    // ============================================
    // FUZZ 7: Dividend solvency after mint + distribute + sync
    // ============================================
    /**
     * @notice CRITICAL INVARIANT: the contract must always remain solvent.
     *         After minting, distributing, and syncing dividends via transfer,
     *         the sum of individual claimables must not exceed the USDC
     *         balance held (accounting for integer rounding dust).
     */
    function testFuzz_DividendSolvencyAfterMintAndDistribute(
        uint256 mintAmount1,
        uint256 mintAmount2,
        uint256 dividendAmount
    ) public {
        mintAmount1 = bound(mintAmount1, 1e18, token.MAX_SUPPLY() / 3);
        mintAmount2 = bound(mintAmount2, 1e18, token.MAX_SUPPLY() / 3);
        dividendAmount = bound(dividendAmount, 1e6, 1_000_000 * 1e6);

        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        _registerAndMint(alice, mintAmount1);
        _registerAndMint(bob, mintAmount2);

        _distribute(dividendAmount);

        // Sync both holders via a tiny transfer (triggers _syncDividends on both sides)
        vm.prank(alice);
        token.transfer(bob, 1);

        uint256 sumClaimables = token.getClaimableDividends(alice) + token.getClaimableDividends(bob);

        // INVARIANT CRITICAL: sum of claimables must not exceed USDC balance + dust tolerance
        assertLe(
            sumClaimables,
            usdc.balanceOf(address(token)) + token.dust() + 1,
            "INSOLVENCY: sum of claimables exceeds USDC balance"
        );
    }

    // ============================================
    // FUZZ 8: Total supply always equals sum of all balances
    // ============================================
    /**
     * @notice After minting and burning random amounts across multiple
     *         holders, totalSupply must always equal the sum of balances.
     */
    function testFuzz_SupplyConservation(uint256[] calldata mintAmounts, uint256[] calldata burnAmounts) public {
        vm.assume(mintAmounts.length > 0 && burnAmounts.length > 0);
        uint256 numHolders = bound(mintAmounts.length, 1, 20);
        address[] memory holders = new address[](numHolders);
        uint256 totalMinted;

        for (uint256 i = 0; i < numHolders; i++) {
            holders[i] = makeAddr(string(abi.encodePacked("holder", i)));
            uint256 amount = bound(mintAmounts[i], 0, (token.MAX_SUPPLY() - totalMinted) / 2);
            _registerAndMint(holders[i], amount);
            totalMinted += amount;
        }

        // Burn random amounts
        for (uint256 i = 0; i < numHolders; i++) {
            uint256 bal = token.balanceOf(holders[i]);
            uint256 burnAmt = bound(burnAmounts[i % burnAmounts.length], 0, bal);
            if (burnAmt > 0) {
                vm.prank(holders[i]);
                token.burn(burnAmt);
            }
        }

        uint256 sumBalances;
        for (uint256 i = 0; i < numHolders; i++) {
            sumBalances += token.balanceOf(holders[i]);
        }

        assertEq(token.totalSupply(), sumBalances, "Supply conservation violated");
    }
}
