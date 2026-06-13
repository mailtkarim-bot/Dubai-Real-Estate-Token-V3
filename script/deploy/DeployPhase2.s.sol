// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Script } from "forge-std/Script.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";
import { HelperConfig } from "../HelperConfig.s.sol";
import { MockUSDC } from "../../test/mocks/MockUSDC.sol";
import { MockIdentity } from "../../test/mocks/MockIdentity.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";

/**
 * @title DeployPhase2
 * @notice Deploys DREIT with UUPS proxies, TimelockController and Gnosis Safe governance.
 * @dev On Anvil, the deployer acts as Gnosis Safe/issuer/regulator for test convenience.
 *      On Sepolia/Mainnet, set GNOSIS_SAFE, ISSUER_ADDRESS and REGULATOR_ADDRESS in .env.
 */
contract DeployPhase2 is Script, HelperConfig {
    struct Deployment {
        address usdc;
        address registryImpl;
        address complianceImpl;
        address tokenImpl;
        address timelock;
        address registryProxy;
        address complianceProxy;
        address tokenProxy;
    }

    function run() external {
        Phase2Config memory config = getPhase2Config();
        uint256 deployerKey = config.deployerKey;
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        Deployment memory d = _deployCore(config, deployer);
        _bootstrap(config, deployer, d);

        vm.stopBroadcast();

        _integrityChecks(d);
        _persistJson(config, deployer, d);
    }

    function _deployCore(Phase2Config memory config, address deployer) internal returns (Deployment memory d) {
        // 1. Stablecoin
        d.usdc = config.usdc;
        if (d.usdc == address(0)) {
            d.usdc = address(new MockUSDC());
        }

        // 2. Implementation contracts
        d.registryImpl = address(new IdentityRegistry());
        d.complianceImpl = address(new ComplianceEngine());
        d.tokenImpl = address(new DubaiRealEstateToken());

        // 3. TimelockController (proposer/executor/canceller = Gnosis Safe)
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = config.gnosisSafe;
        executors[0] = config.gnosisSafe;

        d.timelock = address(new TimelockController(config.timelockMinDelay, proposers, executors, deployer));

        // 4. Deploy proxies with initializer data.
        //    Deployer is the temporary admin so we can bootstrap roles; admin is transferred to Timelock below.
        d.registryProxy = address(
            new ERC1967Proxy(d.registryImpl, abi.encodeWithSelector(IdentityRegistry.initialize.selector, deployer))
        );

        d.complianceProxy = address(
            new ERC1967Proxy(
                d.complianceImpl,
                abi.encodeWithSelector(ComplianceEngine.initialize.selector, deployer, d.registryProxy)
            )
        );

        d.tokenProxy = address(
            new ERC1967Proxy(
                d.tokenImpl,
                abi.encodeWithSelector(
                    DubaiRealEstateToken.initialize.selector,
                    d.usdc,
                    d.registryProxy,
                    d.complianceProxy,
                    "Dubai Real Estate",
                    "DREIT",
                    deployer
                )
            )
        );
    }

    function _bootstrap(Phase2Config memory config, address deployer, Deployment memory d) internal {
        TimelockController timelock = TimelockController(payable(d.timelock));
        IdentityRegistry registry = IdentityRegistry(d.registryProxy);
        ComplianceEngine compliance = ComplianceEngine(d.complianceProxy);
        DubaiRealEstateToken token = DubaiRealEstateToken(d.tokenProxy);

        // Timelock roles for Gnosis Safe
        timelock.grantRole(timelock.PROPOSER_ROLE(), config.gnosisSafe);
        timelock.grantRole(timelock.EXECUTOR_ROLE(), config.gnosisSafe);
        timelock.grantRole(timelock.CANCELLER_ROLE(), config.gnosisSafe);

        // Operational roles
        registry.grantRole(registry.ISSUER_ROLE(), config.issuer);
        token.grantRole(token.ISSUER_ROLE(), config.issuer);
        token.grantRole(token.REGULATOR_ROLE(), config.regulator);
        compliance.grantRole(compliance.REGULATOR_ROLE(), config.regulator);

        // Link token <-> compliance <-> registry
        compliance.bindToken(d.tokenProxy);
        registry.setToken(d.tokenProxy);

        // Seed local Anvil environment
        if (block.chainid == 31337) {
            _seedLocal(token, registry, MockUSDC(d.usdc), config.issuer);
        }

        // Transfer admin ownership from deployer to Timelock
        registry.grantRole(registry.DEFAULT_ADMIN_ROLE(), d.timelock);
        compliance.grantRole(compliance.DEFAULT_ADMIN_ROLE(), d.timelock);
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), d.timelock);

        registry.renounceRole(registry.DEFAULT_ADMIN_ROLE(), deployer);
        compliance.renounceRole(compliance.DEFAULT_ADMIN_ROLE(), deployer);
        token.renounceRole(token.DEFAULT_ADMIN_ROLE(), deployer);

        // Renounce deployer's Timelock admin roles
        timelock.renounceRole(timelock.DEFAULT_ADMIN_ROLE(), deployer);
        timelock.renounceRole(timelock.PROPOSER_ROLE(), deployer);
        timelock.renounceRole(timelock.EXECUTOR_ROLE(), deployer);
        timelock.renounceRole(timelock.CANCELLER_ROLE(), deployer);
    }

    function _integrityChecks(Deployment memory d) internal view {
        DubaiRealEstateToken token = DubaiRealEstateToken(d.tokenProxy);
        IdentityRegistry registry = IdentityRegistry(d.registryProxy);
        ComplianceEngine compliance = ComplianceEngine(d.complianceProxy);

        require(address(token.identityRegistry()) == d.registryProxy, "Registry mismatch");
        require(address(token.complianceEngine()) == d.complianceProxy, "Compliance mismatch");
        require(compliance.token() == d.tokenProxy, "Token not bound");
        require(registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), d.timelock), "Registry admin not Timelock");
        require(token.hasRole(token.DEFAULT_ADMIN_ROLE(), d.timelock), "Token admin not Timelock");
        require(compliance.hasRole(compliance.DEFAULT_ADMIN_ROLE(), d.timelock), "Compliance admin not Timelock");
    }

    function _persistJson(Phase2Config memory config, address deployer, Deployment memory d) internal {
        string memory obj = "deployment";
        vm.serializeUint(obj, "chainId", block.chainid);
        vm.serializeAddress(obj, "deployer", deployer);
        vm.serializeAddress(obj, "gnosisSafe", config.gnosisSafe);
        vm.serializeAddress(obj, "timelock", d.timelock);
        vm.serializeUint(obj, "timelockMinDelay", config.timelockMinDelay);
        vm.serializeAddress(obj, "usdc", d.usdc);
        vm.serializeAddress(obj, "registryProxy", d.registryProxy);
        vm.serializeAddress(obj, "registryImpl", d.registryImpl);
        vm.serializeAddress(obj, "complianceProxy", d.complianceProxy);
        vm.serializeAddress(obj, "complianceImpl", d.complianceImpl);
        vm.serializeAddress(obj, "tokenImpl", d.tokenImpl);
        string memory json = vm.serializeAddress(obj, "tokenProxy", d.tokenProxy);

        vm.createDir("./deployments", true);

        if (block.chainid == 31337) {
            vm.writeFile("./deployments/local.json", json);
        } else if (block.chainid == 11155111) {
            vm.writeFile("./deployments/testnet.json", json);
        } else if (block.chainid == 1) {
            vm.writeFile("./deployments/mainnet.json", json);
        }
    }

    function _seedLocal(DubaiRealEstateToken token, IdentityRegistry registry, MockUSDC usdc, address issuer) internal {
        MockIdentity id1 = new MockIdentity();
        MockIdentity id2 = new MockIdentity();

        address karim = vm.createWallet("local_karim").addr;
        address bob = vm.createWallet("local_bob").addr;

        usdc.mint(karim, 100_000 * 1e6);
        usdc.mint(bob, 100_000 * 1e6);
        usdc.mint(issuer, 1_000_000 * 1e6);

        registry.registerIdentity(karim, address(id1), 784);
        registry.registerIdentity(bob, address(id2), 250);

        token.mint(karim, 1000e18);
        token.mint(bob, 2000e18);
    }
}
