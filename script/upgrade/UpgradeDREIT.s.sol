// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Script, console2 } from "forge-std/Script.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";
import { DubaiRealEstateTokenV2 } from "../../src/core/DubaiRealEstateTokenV2.sol";

/**
 * @title UpgradeDREIT
 * @notice Prepares a UUPS upgrade of the DREIT token via TimelockController.
 * @dev This script deploys V2 and prints the calldata to schedule/execute the upgrade.
 *      On mainnet/Sepolia, the actual schedule/execute must be submitted through the
 *      Gnosis Safe that holds PROPOSER_ROLE and EXECUTOR_ROLE on the Timelock.
 */
contract UpgradeDREIT is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address tokenProxy = vm.envAddress("TOKEN_PROXY");
        address timelock = vm.envAddress("TIMELOCK");

        vm.startBroadcast(deployerKey);

        // 1. Deploy new implementation
        DubaiRealEstateTokenV2 newImpl = new DubaiRealEstateTokenV2();
        console2.log("DubaiRealEstateTokenV2 deployed:", address(newImpl));

        // 2. Encode upgrade call
        bytes memory upgradeData = abi.encodeWithSelector(
            UUPSUpgradeable.upgradeToAndCall.selector,
            address(newImpl),
            "" // no initializer call needed for V2
        );

        // 3. Encode Timelock schedule call
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256(abi.encodePacked(block.timestamp, address(newImpl)));
        uint256 minDelay = TimelockController(payable(timelock)).getMinDelay();

        console2.log("=== UPGRADE WORKFLOW ===");
        console2.log("Target (token proxy):", tokenProxy);
        console2.log("New implementation:", address(newImpl));
        console2.log("Timelock:", timelock);
        console2.log("Min delay (seconds):", minDelay);
        console2.log("Salt:", vm.toString(salt));
        console2.log("");
        console2.log("Step 1 - Schedule via Gnosis Safe calling Timelock.schedule(");
        console2.log("  target:", tokenProxy);
        console2.log("  value: 0");
        console2.log("  data:", vm.toString(upgradeData));
        console2.log("  predecessor: 0x");
        console2.log("  salt:", vm.toString(salt));
        console2.log("  delay:", minDelay);
        console2.log(")");
        console2.log("");
        console2.log("Step 2 - Wait for delay");
        console2.log("");
        console2.log("Step 3 - Execute via Gnosis Safe calling Timelock.execute(");
        console2.log("  target:", tokenProxy);
        console2.log("  value: 0");
        console2.log("  data:", vm.toString(upgradeData));
        console2.log("  predecessor: 0x");
        console2.log("  salt:", vm.toString(salt));
        console2.log(")");

        vm.stopBroadcast();
    }
}
