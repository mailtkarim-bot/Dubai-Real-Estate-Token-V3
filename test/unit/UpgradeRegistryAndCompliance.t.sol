// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";

/**
 * @title UpgradeRegistryAndComplianceTest
 * @notice UUPS upgrade tests for IdentityRegistry and ComplianceEngine proxies.
 */
contract UpgradeRegistryAndComplianceTest is Test {
    address public admin;

    function setUp() public {
        admin = makeAddr("admin");
    }

    function test_UpgradeIdentityRegistry() public {
        IdentityRegistry implV1 = new IdentityRegistry();
        IdentityRegistry implV2 = new IdentityRegistry();

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implV1), abi.encodeWithSelector(IdentityRegistry.initialize.selector, admin)
        );
        IdentityRegistry registry = IdentityRegistry(address(proxy));

        assertEq(address(registry), address(proxy));

        vm.prank(admin);
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(address(implV2), "");

        assertEq(_getImplementation(address(proxy)), address(implV2));
    }

    function test_UpgradeComplianceEngine() public {
        IdentityRegistry registry = _deployRegistry(admin);
        ComplianceEngine implV1 = new ComplianceEngine();
        ComplianceEngine implV2 = new ComplianceEngine();

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implV1),
            abi.encodeWithSelector(ComplianceEngine.initialize.selector, admin, address(registry))
        );

        vm.prank(admin);
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(address(implV2), "");

        assertEq(_getImplementation(address(proxy)), address(implV2));
    }

    function test_UpgradeIdentityRegistry_NonAdminReverts() public {
        IdentityRegistry implV1 = new IdentityRegistry();
        IdentityRegistry implV2 = new IdentityRegistry();

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implV1), abi.encodeWithSelector(IdentityRegistry.initialize.selector, admin)
        );

        address hacker = makeAddr("hacker");
        vm.prank(hacker);
        vm.expectRevert();
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(address(implV2), "");
    }

    function test_UpgradeComplianceEngine_NonAdminReverts() public {
        IdentityRegistry registry = _deployRegistry(admin);
        ComplianceEngine implV1 = new ComplianceEngine();
        ComplianceEngine implV2 = new ComplianceEngine();

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implV1),
            abi.encodeWithSelector(ComplianceEngine.initialize.selector, admin, address(registry))
        );

        address hacker = makeAddr("hacker");
        vm.prank(hacker);
        vm.expectRevert();
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(address(implV2), "");
    }

    function _deployRegistry(address _admin) internal returns (IdentityRegistry) {
        IdentityRegistry impl = new IdentityRegistry();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(impl), abi.encodeWithSelector(IdentityRegistry.initialize.selector, _admin)
        );
        return IdentityRegistry(address(proxy));
    }

    function _getImplementation(address proxy) internal view returns (address) {
        bytes32 slot = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
        return address(uint160(uint256(vm.load(proxy, slot))));
    }
}
