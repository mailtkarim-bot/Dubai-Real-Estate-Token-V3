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

    struct Phase2Config {
        address usdc;
        uint256 deployerKey;
        address gnosisSafe;
        uint256 timelockMinDelay;
        address issuer;
        address regulator;
    }

    address constant USDC_SEPOLIA = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address constant USDC_MAINNET = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    uint256 constant ANVIL_DEFAULT_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 constant DEFAULT_TIMELOCK_DELAY = 172_800; // 48 hours

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

    function getPhase2Config() public view returns (Phase2Config memory) {
        if (block.chainid == 31337) {
            return _getAnvilPhase2Config();
        } else if (block.chainid == 11155111) {
            return _getSepoliaPhase2Config();
        } else if (block.chainid == 1) {
            return _getMainnetPhase2Config();
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

    function _getAnvilPhase2Config() internal view returns (Phase2Config memory) {
        address deployer = vm.addr(vm.envOr("ANVIL_PRIVATE_KEY", ANVIL_DEFAULT_KEY));
        // On Anvil, the deployer also acts as Gnosis Safe, issuer and regulator for testing.
        return Phase2Config({
            usdc: address(0),
            deployerKey: vm.envOr("ANVIL_PRIVATE_KEY", ANVIL_DEFAULT_KEY),
            gnosisSafe: deployer,
            timelockMinDelay: 0, // no delay on Anvil to keep tests fast
            issuer: deployer,
            regulator: deployer
        });
    }

    function _getSepoliaPhase2Config() internal view returns (Phase2Config memory) {
        return Phase2Config({
            usdc: USDC_SEPOLIA,
            deployerKey: vm.envUint("PRIVATE_KEY"),
            gnosisSafe: vm.envAddress("GNOSIS_SAFE"),
            timelockMinDelay: vm.envOr("TIMELOCK_MIN_DELAY", DEFAULT_TIMELOCK_DELAY),
            issuer: vm.envAddress("ISSUER_ADDRESS"),
            regulator: vm.envAddress("REGULATOR_ADDRESS")
        });
    }

    function _getMainnetPhase2Config() internal view returns (Phase2Config memory) {
        return Phase2Config({
            usdc: USDC_MAINNET,
            deployerKey: vm.envUint("PRIVATE_KEY"),
            gnosisSafe: vm.envAddress("GNOSIS_SAFE"),
            timelockMinDelay: vm.envOr("TIMELOCK_MIN_DELAY", DEFAULT_TIMELOCK_DELAY),
            issuer: vm.envAddress("ISSUER_ADDRESS"),
            regulator: vm.envAddress("REGULATOR_ADDRESS")
        });
    }
}
