// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { MockUSDC } from "../mocks/MockUSDC.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";

/**
 * @title DeployDREIT
 * @notice Test helper that deploys the full Phase 2 stack (proxies + implementations).
 * @dev Uses the provided admin as proxy admin/owner. No Timelock by default.
 */
contract DeployDREIT {
    struct DREITDeployment {
        MockUSDC usdc;
        IdentityRegistry registry;
        ComplianceEngine compliance;
        DubaiRealEstateToken token;
        address admin;
    }

    function deployFull(address admin) public returns (DREITDeployment memory) {
        MockUSDC usdc = new MockUSDC();

        IdentityRegistry registryImpl = new IdentityRegistry();
        ComplianceEngine complianceImpl = new ComplianceEngine();
        DubaiRealEstateToken tokenImpl = new DubaiRealEstateToken();

        ERC1967Proxy registryProxy = new ERC1967Proxy(
            address(registryImpl), abi.encodeWithSelector(IdentityRegistry.initialize.selector, admin)
        );
        IdentityRegistry registry = IdentityRegistry(address(registryProxy));

        ERC1967Proxy complianceProxy = new ERC1967Proxy(
            address(complianceImpl),
            abi.encodeWithSelector(ComplianceEngine.initialize.selector, admin, address(registryProxy))
        );
        ComplianceEngine compliance = ComplianceEngine(address(complianceProxy));

        ERC1967Proxy tokenProxy = new ERC1967Proxy(
            address(tokenImpl),
            abi.encodeWithSelector(
                DubaiRealEstateToken.initialize.selector,
                address(usdc),
                address(registryProxy),
                address(complianceProxy),
                "Dubai Real Estate",
                "DREIT",
                admin
            )
        );
        DubaiRealEstateToken token = DubaiRealEstateToken(address(tokenProxy));

        // Operational wiring
        registry.setToken(address(tokenProxy));
        compliance.bindToken(address(tokenProxy));

        return DREITDeployment({ usdc: usdc, registry: registry, compliance: compliance, token: token, admin: admin });
    }
}
