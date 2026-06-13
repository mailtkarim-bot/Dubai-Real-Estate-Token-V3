// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";
import { DubaiRealEstateTokenV2 } from "../../src/core/DubaiRealEstateTokenV2.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";
import { MockUSDC } from "../mocks/MockUSDC.sol";
import { MockIdentity } from "../mocks/MockIdentity.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title DREITUpgradeTest
 * @notice Tests UUPS upgradeability, storage preservation and Timelock governance.
 */
contract DREITUpgradeTest is Test {
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;

    address public admin;
    address public issuer;
    address public regulator;
    address public karim;

    uint256 constant INITIAL_MINT = 1000e18;

    function setUp() public {
        admin = makeAddr("admin");
        issuer = makeAddr("issuer");
        regulator = makeAddr("regulator");
        karim = makeAddr("karim");

        vm.startPrank(admin);
        usdc = new MockUSDC();

        registry = _deployRegistry(admin);
        compliance = _deployCompliance(admin, address(registry));
        token = _deployToken(address(usdc), address(registry), address(compliance), admin);

        token.grantRole(token.ISSUER_ROLE(), issuer);
        token.grantRole(token.REGULATOR_ROLE(), regulator);
        registry.grantRole(registry.ISSUER_ROLE(), admin);
        compliance.bindToken(address(token));
        registry.setToken(address(token));
        vm.stopPrank();

        MockIdentity id = new MockIdentity();
        vm.prank(admin);
        registry.registerIdentity(karim, address(id), 784);

        vm.prank(issuer);
        token.mint(karim, INITIAL_MINT);
    }

    function _deployRegistry(address _admin) internal returns (IdentityRegistry) {
        IdentityRegistry impl = new IdentityRegistry();
        ERC1967Proxy proxy =
            new ERC1967Proxy(address(impl), abi.encodeWithSelector(IdentityRegistry.initialize.selector, _admin));
        return IdentityRegistry(address(proxy));
    }

    function _deployCompliance(address _admin, address _registry) internal returns (ComplianceEngine) {
        ComplianceEngine impl = new ComplianceEngine();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(impl), abi.encodeWithSelector(ComplianceEngine.initialize.selector, _admin, _registry)
        );
        return ComplianceEngine(address(proxy));
    }

    function _deployToken(address _usdc, address _registry, address _compliance, address _admin)
        internal
        returns (DubaiRealEstateToken)
    {
        DubaiRealEstateToken impl = new DubaiRealEstateToken();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(impl),
            abi.encodeWithSelector(
                DubaiRealEstateToken.initialize.selector,
                _usdc,
                _registry,
                _compliance,
                "Dubai Real Estate",
                "DREIT",
                _admin
            )
        );
        return DubaiRealEstateToken(address(proxy));
    }

    // ============================================
    // UPGRADE TESTS
    // ============================================

    function test_Upgrade_StoragePreserved() public {
        assertEq(token.balanceOf(karim), INITIAL_MINT);

        DubaiRealEstateTokenV2 newImpl = new DubaiRealEstateTokenV2();

        vm.prank(admin);
        token.upgradeToAndCall(address(newImpl), "");

        assertEq(token.balanceOf(karim), INITIAL_MINT, "Balance must be preserved");
        assertEq(DubaiRealEstateTokenV2(address(token)).version(), 2, "Version must be 2");
    }

    function test_Upgrade_NonAdminReverts() public {
        DubaiRealEstateTokenV2 newImpl = new DubaiRealEstateTokenV2();
        address hacker = makeAddr("hacker");
        bytes32 adminRole = token.DEFAULT_ADMIN_ROLE();

        vm.prank(hacker);
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, hacker, adminRole)
        );
        token.upgradeToAndCall(address(newImpl), "");
    }

    function test_Initialize_CannotBeCalledTwice() public {
        vm.prank(admin);
        vm.expectRevert();
        token.initialize(address(usdc), address(registry), address(compliance), "X", "X", admin);
    }

    // ============================================
    // TIMELOCK TESTS
    // ============================================

    function test_Timelock_DelayEnforced() public {
        address gnosisSafe = makeAddr("gnosisSafe");
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = gnosisSafe;
        executors[0] = gnosisSafe;

        vm.prank(admin);
        TimelockController timelock = new TimelockController(2 days, proposers, executors, admin);

        // Transfer token admin to timelock
        vm.startPrank(admin);
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), address(timelock));
        token.renounceRole(token.DEFAULT_ADMIN_ROLE(), admin);
        vm.stopPrank();

        DubaiRealEstateTokenV2 newImpl = new DubaiRealEstateTokenV2();
        bytes4 upgradeSelector = bytes4(keccak256("upgradeToAndCall(address,bytes)"));
        bytes memory data = abi.encodeWithSelector(upgradeSelector, address(newImpl), "");
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256("test");

        // Schedule from Gnosis Safe
        vm.prank(gnosisSafe);
        timelock.schedule(address(token), 0, data, predecessor, salt, 2 days);

        // Execute immediately should revert
        vm.prank(gnosisSafe);
        vm.expectRevert();
        timelock.execute(address(token), 0, data, predecessor, salt);

        // Warp past delay
        vm.warp(block.timestamp + 2 days + 1);

        vm.prank(gnosisSafe);
        timelock.execute(address(token), 0, data, predecessor, salt);

        assertEq(DubaiRealEstateTokenV2(address(token)).version(), 2, "Upgrade via timelock must succeed");
    }

    function test_Timelock_OnlyProposerCanSchedule() public {
        address gnosisSafe = makeAddr("gnosisSafe");
        address hacker = makeAddr("hacker");
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = gnosisSafe;
        executors[0] = gnosisSafe;

        vm.prank(admin);
        TimelockController timelock = new TimelockController(2 days, proposers, executors, admin);

        bytes memory data = abi.encodeWithSelector(DubaiRealEstateToken.pause.selector);
        bytes32 salt = keccak256("test");

        vm.prank(hacker);
        vm.expectRevert();
        timelock.schedule(address(token), 0, data, bytes32(0), salt, 2 days);
    }
}
