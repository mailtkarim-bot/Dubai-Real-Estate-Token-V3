// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Test } from "forge-std/Test.sol";
import { DubaiRealEstateToken } from "../../src/core/DubaiRealEstateToken.sol";
import { IdentityRegistry } from "../../src/compliance/IdentityRegistry.sol";
import { ComplianceEngine } from "../../src/compliance/ComplianceEngine.sol";
import { MockUSDC } from "../mocks/MockUSDC.sol";
import { MockIdentity } from "../mocks/MockIdentity.sol";
import { IIdentityRegistry } from "../../src/interfaces/IIdentityRegistry.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title DREITHandler
 * @notice Handler for invariant testing. Exposes actor-facing actions that the
 *         invariant fuzzer can call in random sequences.
 */
contract DREITHandler is Test {
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;

    address public admin;
    address public issuer;
    address public regulator;
    address[] public actors;

    // Ghost variables used by invariants.
    uint256 public ghostDividendPerToken;
    mapping(address => bool) public ghostFrozen;
    mapping(uint16 => bool) public ghostRestrictedCountry;
    bool public ghostWhitelistEnabled;
    mapping(address => bool) public ghostWhitelisted;

    constructor(
        DubaiRealEstateToken _token,
        IdentityRegistry _registry,
        ComplianceEngine _compliance,
        MockUSDC _usdc,
        address _admin,
        address _issuer,
        address _regulator,
        address[] memory _actors
    ) {
        token = _token;
        registry = _registry;
        compliance = _compliance;
        usdc = _usdc;
        admin = _admin;
        issuer = _issuer;
        regulator = _regulator;
        actors = _actors;
    }

    function _randomActor(uint256 seed) internal view returns (address) {
        return actors[seed % actors.length];
    }

    function mint(uint256 amount, uint256 actorSeed) external {
        address to = _randomActor(actorSeed);
        if (compliance.isFrozen(to)) return;

        uint256 max = token.MAX_SUPPLY() - token.totalSupply();
        if (max == 0) return;

        amount = bound(amount, 1, max);

        vm.startPrank(issuer);
        token.mint(to, amount);
        vm.stopPrank();
    }

    function burn(uint256 amount, uint256 actorSeed) external {
        address from = _randomActor(actorSeed);
        if (compliance.isFrozen(from)) return;

        uint256 balance = token.balanceOf(from);
        if (balance == 0) return;

        amount = bound(amount, 1, balance);

        vm.prank(from);
        token.burn(amount);
    }

    function transfer(uint256 amount, uint256 fromSeed, uint256 toSeed) external {
        address from = _randomActor(fromSeed);
        address to = _randomActor(toSeed);

        if (from == to) return;
        if (to == address(token)) return;
        if (compliance.isFrozen(from) || compliance.isFrozen(to)) return;

        uint256 balance = token.balanceOf(from);
        if (balance == 0) return;

        amount = bound(amount, 1, balance);

        vm.prank(from);
        token.transfer(to, amount);
    }

    function distributeDividends(uint256 amount) external {
        uint256 totalSupply = token.totalSupply();
        if (totalSupply == 0) return;

        uint256 issuerBalance = usdc.balanceOf(issuer);
        if (issuerBalance == 0) return;

        // Minimum amount so that newDividendPerToken > 0.
        // newDividendPerToken = (amount * 1e18) / totalSupply must be >= 1.
        uint256 min = totalSupply / 1e18 + 1;
        if (min > issuerBalance) return;

        amount = bound(amount, min, issuerBalance);

        vm.startPrank(issuer);
        usdc.approve(address(token), amount);
        token.distributeDividends(amount);
        vm.stopPrank();

        ghostDividendPerToken = token.dividendPerToken();
    }

    function claimDividends(uint256 actorSeed) external {
        address user = _randomActor(actorSeed);
        if (compliance.isFrozen(user)) return;
        if (token.getClaimableDividends(user) == 0) return;

        vm.prank(user);
        token.claimDividends();
    }

    function freezeInvestor(uint256 actorSeed) external {
        address user = _randomActor(actorSeed);

        vm.prank(regulator);
        compliance.freezeInvestor(user, "invariant");

        ghostFrozen[user] = true;
    }

    function unfreezeInvestor(uint256 actorSeed) external {
        address user = _randomActor(actorSeed);

        vm.prank(regulator);
        compliance.unfreezeInvestor(user);

        ghostFrozen[user] = false;
    }

    function restrictCountry(uint16 country) external {
        country = uint16(bound(uint256(country), 1, 999));

        vm.prank(regulator);
        compliance.restrictCountry(country);

        ghostRestrictedCountry[country] = true;
    }

    function unrestrictCountry(uint16 country) external {
        country = uint16(bound(uint256(country), 1, 999));

        vm.prank(regulator);
        compliance.unrestrictCountry(country);

        ghostRestrictedCountry[country] = false;
    }

    function setWhitelistEnabled(bool enabled) external {
        vm.prank(admin);
        compliance.setWhitelistEnabled(enabled);

        ghostWhitelistEnabled = enabled;
    }

    function setWhitelisted(uint256 actorSeed, bool status) external {
        address user = _randomActor(actorSeed);

        vm.prank(regulator);
        compliance.setWhitelisted(user, status);

        ghostWhitelisted[user] = status;
    }
}

/**
 * @title DubaiRealEstateTokenInvariantTest
 * @notice Invariant tests for the DREIT token system.
 */
contract DubaiRealEstateTokenInvariantTest is Test {
    DubaiRealEstateToken public token;
    IdentityRegistry public registry;
    ComplianceEngine public compliance;
    MockUSDC public usdc;
    DREITHandler public handler;

    address public admin = makeAddr("admin");
    address public issuer = makeAddr("issuer");
    address public regulator = makeAddr("regulator");
    address[] public actors;

    function setUp() public {
        // Deploy USDC and fund issuer.
        vm.startPrank(admin);
        usdc = new MockUSDC();
        usdc.mint(issuer, 1_000_000_000 * 10 ** usdc.decimals());
        vm.stopPrank();

        // Deploy core contracts.
        vm.startPrank(admin);
        registry = _deployRegistry(admin);
        registry.grantRole(registry.ISSUER_ROLE(), issuer);

        compliance = _deployCompliance(admin, address(registry));
        compliance.grantRole(compliance.REGULATOR_ROLE(), regulator);

        token = _deployToken(address(usdc), address(registry), address(compliance), admin);
        token.grantRole(token.ISSUER_ROLE(), issuer);
        token.grantRole(token.REGULATOR_ROLE(), regulator);

        registry.setToken(address(token));
        compliance.bindToken(address(token));
        vm.stopPrank();

        // Register 5 KYC-verified actors.
        for (uint256 i = 0; i < 5; i++) {
            address actor = makeAddr(string(abi.encodePacked("actor", i)));
            MockIdentity identity = new MockIdentity();

            vm.prank(issuer);
            registry.registerIdentity(actor, address(identity), 784);

            actors.push(actor);
        }

        handler = new DREITHandler(token, registry, compliance, usdc, admin, issuer, regulator, actors);
        targetContract(address(handler));

        // Seed the system with a small supply so dividends can be distributed.
        vm.startPrank(issuer);
        for (uint256 i = 0; i < actors.length; i++) {
            token.mint(actors[i], 1000e18);
        }
        vm.stopPrank();
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

    // ============================================================
    // INVARIANTS
    // ============================================================

    function invariant_SupplyAtMostMax() public view {
        assertLe(token.totalSupply(), token.MAX_SUPPLY(), "Supply exceeded max");
    }

    function invariant_BalanceSumEqualsTotalSupply() public view {
        uint256 sum;
        for (uint256 i = 0; i < actors.length; i++) {
            sum += token.balanceOf(actors[i]);
        }
        assertEq(sum, token.totalSupply(), "Balance sum mismatch");
    }

    function invariant_SumClaimablesLeStablecoinBalancePlusDust() public view {
        uint256 sumClaimables;
        for (uint256 i = 0; i < actors.length; i++) {
            sumClaimables += token.getClaimableDividends(actors[i]);
        }
        assertLe(
            sumClaimables,
            usdc.balanceOf(address(token)) + token.dust() + 1,
            "Sum of claimables exceeds stablecoin balance"
        );
    }

    function invariant_DividendPerTokenMonotonic() public view {
        assertGe(
            token.dividendPerToken(),
            handler.ghostDividendPerToken(),
            "Dividend per token must never decrease"
        );
    }

    function invariant_NoTokensHeldByTokenContract() public view {
        assertEq(token.balanceOf(address(token)), 0, "Token contract must not hold tokens");
    }

    function invariant_FrozenStateMatchesGhost() public view {
        for (uint256 i = 0; i < actors.length; i++) {
            assertEq(
                compliance.isFrozen(actors[i]),
                handler.ghostFrozen(actors[i]),
                "Frozen state mismatch"
            );
        }
    }
}
