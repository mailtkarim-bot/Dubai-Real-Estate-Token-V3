// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {HelperConfig} from "../HelperConfig.s.sol";
import {IdentityRegistry} from "../../src/compliance/IdentityRegistry.sol";
import {ComplianceEngine} from "../../src/compliance/ComplianceEngine.sol";
import {DubaiRealEstateToken} from "../../src/core/DubaiRealEstateToken.sol";

/**
 * @title DeployMainnet
 * @notice Production deployment template with TimelockController + Multisig.
 * @custom:security WARNING — This is an educational template. Do NOT deploy
 *      to mainnet without: (1) external audit, (2) real multisig hardware wallets,
 *      (3) legal opinion, (4) insurance.
 */
contract DeployMainnet is Script, HelperConfig {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        address usdc = vm.envAddress("USDC_ADDRESS");
        string memory proposersCsv = vm.envString("MULTISIG_PROPOSERS");
        string memory executorsCsv = vm.envString("MULTISIG_EXECUTORS");
        uint256 minDelay = vm.envUint("TIMELOCK_MIN_DELAY"); // e.g., 172800 = 48h

        address[] memory proposers = _parseAddresses(proposersCsv);
        address[] memory executors = _parseAddresses(executorsCsv);

        vm.startBroadcast(deployerKey);

        // 1. TimelockController (governance layer)
        TimelockController timelock = new TimelockController(
            minDelay,
            proposers,
            executors,
            deployer // temporary admin
        );
        console2.log("TimelockController:", address(timelock));

        // 2. IdentityRegistry (admin = timelock)
        IdentityRegistry registry = new IdentityRegistry(address(timelock));
        console2.log("IdentityRegistry:", address(registry));

        // 3. ComplianceEngine (admin = timelock)
        ComplianceEngine compliance = new ComplianceEngine(address(timelock), address(registry));
        console2.log("ComplianceEngine:", address(compliance));

        // 4. DubaiRealEstateToken (admin = timelock)
        DubaiRealEstateToken token = new DubaiRealEstateToken(
            usdc,
            address(registry),
            address(compliance),
            "Dubai Real Estate",
            "DREIT",
            address(timelock)
        );
        console2.log("DubaiRealEstateToken:", address(token));

        // 5. Initial setup (deployer acts before renouncing)
        registry.grantRole(registry.ISSUER_ROLE(), proposers[0]);
        token.grantRole(token.ISSUER_ROLE(), proposers[0]);
        token.grantRole(token.REGULATOR_ROLE(), proposers[0]);
        compliance.grantRole(compliance.REGULATOR_ROLE(), proposers[0]);
        compliance.bindToken(address(token));

        // 6. Renounce direct control
        timelock.renounceRole(timelock.DEFAULT_ADMIN_ROLE(), deployer);
        timelock.renounceRole(timelock.PROPOSER_ROLE(), deployer);
        timelock.renounceRole(timelock.EXECUTOR_ROLE(), deployer);

        vm.stopBroadcast();

        // Persist
        string memory json = string.concat(
            '{"chainId":"', vm.toString(block.chainid), '",',
            '"deployer":"', vm.toString(deployer), '",',
            '"timelock":"', vm.toString(address(timelock)), '",',
            '"usdc":"', vm.toString(usdc), '",',
            '"registry":"', vm.toString(address(registry)), '",',
            '"compliance":"', vm.toString(address(compliance)), '",',
            '"token":"', vm.toString(address(token)), '"}'
        );
        vm.createDir("./deployments", true);
        vm.writeFile("./deployments/mainnet.json", json);

        console2.log("=== MAINNET DEPLOYMENT COMPLETE ===");
        console2.log("CRITICAL: All admin operations now require Timelock + Multisig");
    }

    function _parseAddresses(string memory csv) internal pure returns (address[] memory) {
        // Uses Foundry's built-in split + parseAddress for safety
        string[] memory parts = vm.split(csv, ",");
        address[] memory addrs = new address[](parts.length);
        for (uint256 i = 0; i < parts.length; i++) {
            addrs[i] = vm.parseAddress(parts[i]);
        }
        return addrs;
    }
}
