// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {HelperConfig} from "../HelperConfig.s.sol";
import {IdentityRegistry} from "../../src/compliance/IdentityRegistry.sol";
import {ComplianceEngine} from "../../src/compliance/ComplianceEngine.sol";
import {DubaiRealEstateToken} from "../../src/core/DubaiRealEstateToken.sol";

/**
 * @title DeployTestnet
 * @notice Deployment on Sepolia with official USDC testnet token.
 * @dev USDC Sepolia: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
 *      Etherscan verification recommended after deployment.
 */
contract DeployTestnet is Script, HelperConfig {
    function run() external {
        NetworkConfig memory config = getConfig();
        uint256 deployerKey = config.deployerKey;
        address deployer = vm.addr(deployerKey);
        address usdc = config.usdc;

        vm.startBroadcast(deployerKey);

        IdentityRegistry registry = new IdentityRegistry(deployer);
        console2.log("IdentityRegistry:", address(registry));

        ComplianceEngine compliance = new ComplianceEngine(deployer, address(registry));
        console2.log("ComplianceEngine:", address(compliance));

        DubaiRealEstateToken token = new DubaiRealEstateToken(
            usdc,
            address(registry),
            address(compliance),
            "Dubai Real Estate",
            "DREIT",
            deployer
        );
        console2.log("DubaiRealEstateToken:", address(token));

        // Configuration
        compliance.bindToken(address(token));

        vm.stopBroadcast();

        // Integrity
        require(address(token.identityRegistry()) == address(registry), "Registry mismatch");
        require(address(token.complianceEngine()) == address(compliance), "Compliance mismatch");
        require(compliance.token() == address(token), "Token not bound");

        // Persist
        string memory json = string.concat(
            '{"chainId":"', vm.toString(block.chainid), '",',
            '"deployer":"', vm.toString(deployer), '",',
            '"usdc":"', vm.toString(usdc), '",',
            '"registry":"', vm.toString(address(registry)), '",',
            '"compliance":"', vm.toString(address(compliance)), '",',
            '"token":"', vm.toString(address(token)), '"}'
        );
        vm.createDir("./deployments", true);
        vm.writeFile("./deployments/testnet.json", json);

        console2.log("=== TESTNET DEPLOYMENT COMPLETE ===");
        console2.log("Verify with:");
        console2.log(
            "forge verify-contract <token-address> DubaiRealEstateToken --constructor-args $(cast abi-encode \"constructor(address,address,address,string,string,address)\" <usdc> <registry> <compliance> \"Dubai Real Estate\" \"DREIT\" <admin>)"
        );
    }
}
