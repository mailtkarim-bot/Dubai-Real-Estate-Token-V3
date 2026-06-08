// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {HelperConfig} from "../HelperConfig.s.sol";
import {MockUSDC} from "../../test/mocks/MockUSDC.sol";
import {MockIdentity} from "../../test/mocks/MockIdentity.sol";
import {IdentityRegistry} from "../../src/compliance/IdentityRegistry.sol";
import {ComplianceEngine} from "../../src/compliance/ComplianceEngine.sol";
import {DubaiRealEstateToken} from "../../src/core/DubaiRealEstateToken.sol";

/**
 * @title DeployLocal
 * @notice Full deployment on Anvil with seed data and JSON persistence.
 * @dev The deployer receives all roles. DO NOT use in production.
 */
contract DeployLocal is Script, HelperConfig {
    function run() external {
        NetworkConfig memory config = getConfig();
        uint256 deployerKey = config.deployerKey;
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // 1. MockUSDC
        MockUSDC usdc = new MockUSDC();
        console2.log("[1/4] MockUSDC:", address(usdc));

        // 2. IdentityRegistry
        IdentityRegistry registry = new IdentityRegistry(deployer);
        console2.log("[2/4] IdentityRegistry:", address(registry));

        // 3. ComplianceEngine
        ComplianceEngine compliance = new ComplianceEngine(deployer, address(registry));
        console2.log("[3/4] ComplianceEngine:", address(compliance));

        // 4. DubaiRealEstateToken
        DubaiRealEstateToken token = new DubaiRealEstateToken(
            address(usdc),
            address(registry),
            address(compliance),
            "Dubai Real Estate",
            "DREIT",
            deployer
        );
        console2.log("[4/4] DubaiRealEstateToken:", address(token));

        // 5. Link Token <-> Compliance
        compliance.bindToken(address(token));

        // 6. Seed data for integration tests
        _seedData(registry, token, usdc, deployer);

        vm.stopBroadcast();

        // 7. Integrity checks (off-chain, no broadcast)
        require(address(token.identityRegistry()) == address(registry), "Registry mismatch");
        require(address(token.complianceEngine()) == address(compliance), "Compliance mismatch");
        require(compliance.token() == address(token), "Token not bound");

        // 8. Persist deployment addresses
        string memory json = string.concat(
            '{"chainId":"', vm.toString(block.chainid), '",',
            '"deployer":"', vm.toString(deployer), '",',
            '"usdc":"', vm.toString(address(usdc)), '",',
            '"registry":"', vm.toString(address(registry)), '",',
            '"compliance":"', vm.toString(address(compliance)), '",',
            '"token":"', vm.toString(address(token)), '"}'
        );
        vm.createDir("./deployments", true);
        vm.writeFile("./deployments/local.json", json);

        console2.log("=== LOCAL DEPLOYMENT VERIFIED & PERSISTED ===");
        console2.log("File: ./deployments/local.json");
    }

    function _seedData(
        IdentityRegistry registry,
        DubaiRealEstateToken token,
        MockUSDC usdc,
        address issuer
    ) internal {
        MockIdentity id1 = new MockIdentity();
        MockIdentity id2 = new MockIdentity();

        // Use vm.createWallet for deterministic addresses in scripts
        address karim = vm.createWallet("local_karim").addr;
        address bob = vm.createWallet("local_bob").addr;

        // Faucet USDC
        usdc.mint(karim, 100_000 * 1e6);
        usdc.mint(bob, 100_000 * 1e6);
        usdc.mint(issuer, 1_000_000 * 1e6);

        // KYC
        registry.registerIdentity(karim, address(id1), 784);
        registry.registerIdentity(bob, address(id2), 250);

        // Mint DREIT
        token.mint(karim, 1000e18);
        token.mint(bob, 2000e18);

        console2.log("Seeded: Karim", karim, "| Bob", bob);
    }
}
