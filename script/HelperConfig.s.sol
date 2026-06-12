// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Script } from "forge-std/Script.sol";

/**
 * @title HelperConfig
 * @notice Pure configuration helper — NO broadcast, NO storage, NO deployment.
 * @dev Returns the correct USDC address and deployer key based on the chain.
 */
abstract contract HelperConfig is Script {
    struct NetworkConfig {
        address usdc;
        uint256 deployerKey;
    }

    address constant USDC_SEPOLIA = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address constant USDC_MAINNET = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    uint256 constant ANVIL_DEFAULT_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function getConfig() public view returns (NetworkConfig memory) {
        if (block.chainid == 31337) {
            return _getAnvilConfig();
        } else if (block.chainid == 11155111) {
            return _getSepoliaConfig();
        } else if (block.chainid == 1) {
            return _getMainnetConfig();
        } else {
            revert(string.concat("HelperConfig: Unsupported chain ", vm.toString(block.chainid)));
        }
    }

    function _getAnvilConfig() internal view returns (NetworkConfig memory) {
        return NetworkConfig({
            usdc: address(0), // DeployLocal deploys MockUSDC and fills this
            deployerKey: vm.envOr("ANVIL_PRIVATE_KEY", ANVIL_DEFAULT_KEY)
        });
    }

    function _getSepoliaConfig() internal view returns (NetworkConfig memory) {
        return NetworkConfig({ usdc: USDC_SEPOLIA, deployerKey: vm.envUint("PRIVATE_KEY") });
    }

    function _getMainnetConfig() internal view returns (NetworkConfig memory) {
        return NetworkConfig({ usdc: USDC_MAINNET, deployerKey: vm.envUint("PRIVATE_KEY") });
    }
}
