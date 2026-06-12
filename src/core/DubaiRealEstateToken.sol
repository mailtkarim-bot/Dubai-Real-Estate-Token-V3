// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IIdentityRegistry } from "../interfaces/IIdentityRegistry.sol";
import { IComplianceEngine } from "../interfaces/IComplianceEngine.sol";
import { IDividendAware } from "../interfaces/IDividendAware.sol";

/**
 * @title DubaiRealEstateToken
 * @author Steph Rayan
 * @notice ERC-3643 inspired permissioned security token for Dubai RWA real estate — v3.1.
 * @custom:security Educational / portfolio project. Internal review only. No external audit.
 *      Not production-ready without a Tier-1 audit, legal opinion and regulated entity.
 *      Dust auto-redistributed. All transfers gated by KYC + Compliance.
 * @dev Dividends use Pull-over-Push with retroactive-gain protection.
 */
contract DubaiRealEstateToken is ERC20, AccessControl, Pausable, ReentrancyGuard, IDividendAware {
    using SafeERC20 for IERC20;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");

    uint256 public constant MAX_SUPPLY = 50_000 * 10 ** 18;

    IERC20 public immutable stablecoin;
    IIdentityRegistry public identityRegistry;
    IComplianceEngine public complianceEngine;

    uint256 public dividendPerToken;
    uint256 public dust;

    mapping(address => uint256) public lastClaimed;
    mapping(address => uint256) public pendingDividends;
    uint256 public totalPendingDividends;

    event TokensMinted(address indexed to, uint256 amount, address indexed actor);
    event TokensBurned(address indexed from, uint256 amount, address indexed actor);
    event DividendsDistributed(
        uint256 amount, uint256 newDividendPerToken, uint256 totalDividendPerToken, address indexed actor
    );
    event DividendClaimed(address indexed by, uint256 amount);
    event DividendSynced(address indexed investor, uint256 amount);
    event ForcedTransfer(
        address indexed from, address indexed to, uint256 amount, string reason, address indexed actor
    );
    event ForcedBurn(address indexed from, uint256 amount, string reason, address indexed actor);
    event IdentityRegistrySet(address indexed oldRegistry, address indexed newRegistry, address indexed actor);
    event ComplianceEngineSet(address indexed oldEngine, address indexed newEngine, address indexed actor);

    error DREIT__ZeroAddress();
    error DREIT__NotContract(address addr);
    error DREIT__InvalidAmount();
    error DREIT__MaxSupplyExceeded(uint256 wouldBe, uint256 max);
    error DREIT__KYCNotVerified(address investor);
    error DREIT__TransferNotCompliant(address from, address to);
    error DREIT__NoDividendsToClaim();
    error DREIT__SelfTransfer();
    error DREIT__InsufficientBalance();
    error DREIT__AccountFrozen(address account);
    error DREIT__ArrayLengthMismatch();

    modifier nonZeroAddress(address addr) {
        if (addr == address(0)) revert DREIT__ZeroAddress();
        _;
    }

    modifier notFrozen(address account) {
        if (complianceEngine.isFrozen(account)) revert DREIT__AccountFrozen(account);
        _;
    }

    constructor(
        address _stablecoin,
        address _identityRegistry,
        address _complianceEngine,
        string memory _name,
        string memory _symbol,
        address _admin
    ) ERC20(_name, _symbol) {
        if (_stablecoin == address(0)) revert DREIT__ZeroAddress();
        if (_identityRegistry == address(0)) revert DREIT__ZeroAddress();
        if (_complianceEngine == address(0)) revert DREIT__ZeroAddress();
        if (_admin == address(0)) revert DREIT__ZeroAddress();

        if (_stablecoin.code.length == 0) revert DREIT__NotContract(_stablecoin);
        if (_identityRegistry.code.length == 0) revert DREIT__NotContract(_identityRegistry);
        if (_complianceEngine.code.length == 0) revert DREIT__NotContract(_complianceEngine);

        stablecoin = IERC20(_stablecoin);
        identityRegistry = IIdentityRegistry(_identityRegistry);
        complianceEngine = IComplianceEngine(_complianceEngine);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ISSUER_ROLE, _admin);
        _grantRole(REGULATOR_ROLE, _admin);
    }

    function mint(address to, uint256 amount)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonReentrant
        nonZeroAddress(to)
        notFrozen(to)
    {
        if (amount == 0) revert DREIT__InvalidAmount();
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert DREIT__MaxSupplyExceeded(totalSupply() + amount, MAX_SUPPLY);
        }

        _validateKYC(to);
        if (!complianceEngine.canCreate(to, amount)) {
            revert DREIT__TransferNotCompliant(address(0), to);
        }

        if (lastClaimed[to] == 0 && balanceOf(to) == 0) {
            lastClaimed[to] = dividendPerToken;
        } else {
            _syncDividends(to);
        }

        _mint(to, amount);
        complianceEngine.created(to, amount);

        emit TokensMinted(to, amount, msg.sender);
    }

    function batchMint(address[] calldata recipients, uint256[] calldata amounts)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
        nonReentrant
    {
        uint256 length = recipients.length;
        if (length != amounts.length) revert DREIT__ArrayLengthMismatch();
        if (length > 100) revert DREIT__ArrayLengthMismatch();

        uint256 total;
        for (uint256 i; i < length; ++i) {
            total += amounts[i];
        }
        if (totalSupply() + total > MAX_SUPPLY) {
            revert DREIT__MaxSupplyExceeded(totalSupply() + total, MAX_SUPPLY);
        }

        for (uint256 i; i < length; ++i) {
            address to = recipients[i];
            uint256 amount = amounts[i];
            if (to == address(0)) revert DREIT__ZeroAddress();
            if (complianceEngine.isFrozen(to)) revert DREIT__AccountFrozen(to);
            if (amount == 0) continue;

            _validateKYC(to);
            if (!complianceEngine.canCreate(to, amount)) {
                revert DREIT__TransferNotCompliant(address(0), to);
            }

            if (lastClaimed[to] == 0 && balanceOf(to) == 0) {
                lastClaimed[to] = dividendPerToken;
            } else {
                _syncDividends(to);
            }

            _mint(to, amount);
            complianceEngine.created(to, amount);
            emit TokensMinted(to, amount, msg.sender);
        }
    }

    function burn(uint256 amount) external whenNotPaused nonReentrant notFrozen(msg.sender) {
        if (amount == 0) revert DREIT__InvalidAmount();
        address investor = msg.sender;

        _validateKYC(investor);
        if (!complianceEngine.canDestroy(investor, amount)) {
            revert DREIT__TransferNotCompliant(investor, address(0));
        }

        _syncDividends(investor);

        uint256 claimable = pendingDividends[investor];
        pendingDividends[investor] = 0;
        totalPendingDividends -= claimable;

        // Checks-Effects-Interactions: burn and update compliance state BEFORE
        // any external stablecoin transfer.
        _burn(investor, amount);
        complianceEngine.destroyed(investor, amount);

        emit TokensBurned(investor, amount, msg.sender);

        if (claimable > 0) {
            stablecoin.safeTransfer(investor, claimable);
            emit DividendClaimed(investor, claimable);
        }
    }

    function forcedTransfer(address from, address to, uint256 amount, string calldata reason)
        external
        onlyRole(REGULATOR_ROLE)
        whenNotPaused
        nonReentrant
        nonZeroAddress(from)
        nonZeroAddress(to)
    {
        if (amount == 0) revert DREIT__InvalidAmount();
        if (balanceOf(from) < amount) revert DREIT__InsufficientBalance();
        if (complianceEngine.isFrozen(to)) revert DREIT__AccountFrozen(to);

        _validateKYC(from);
        _validateKYC(to);
        if (!complianceEngine.isCompliant(from, to, amount)) {
            revert DREIT__TransferNotCompliant(from, to);
        }

        // _transfer already triggers _update, which calls complianceEngine.transferred().
        // Calling it again here would double-count stateful compliance modules.
        _transfer(from, to, amount);

        emit ForcedTransfer(from, to, amount, reason, msg.sender);
    }

    function forcedBurn(address from, uint256 amount, string calldata reason)
        external
        onlyRole(REGULATOR_ROLE)
        whenNotPaused
        nonReentrant
        nonZeroAddress(from)
    {
        if (amount == 0) revert DREIT__InvalidAmount();
        if (balanceOf(from) < amount) revert DREIT__InsufficientBalance();

        _syncDividends(from);

        uint256 claimable = pendingDividends[from];
        pendingDividends[from] = 0;
        totalPendingDividends -= claimable;

        // Checks-Effects-Interactions: burn and update compliance state BEFORE
        // any external stablecoin transfer.
        _burn(from, amount);
        complianceEngine.destroyed(from, amount);

        emit ForcedBurn(from, amount, reason, msg.sender);

        if (claimable > 0) {
            stablecoin.safeTransfer(from, claimable);
            emit DividendClaimed(from, claimable);
        }
    }

    /**
     * @notice Distributes dividends to all token holders.
     * @dev Automatically redistributes accumulated dust from previous rounds.
     */
    function distributeDividends(uint256 amount) external onlyRole(ISSUER_ROLE) whenNotPaused nonReentrant {
        if (amount == 0) revert DREIT__InvalidAmount();
        if (totalSupply() == 0) revert DREIT__InvalidAmount();

        uint256 totalAmount = amount + dust;

        // Validate arithmetic BEFORE pulling any stablecoin to avoid
        // locking user funds as recoverable dust on revert.
        uint256 newDividendPerToken = (totalAmount * 1e18) / totalSupply();
        if (newDividendPerToken == 0) revert DREIT__InvalidAmount();

        dust = 0;
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);

        uint256 distributed = (newDividendPerToken * totalSupply()) / 1e18;

        dust += totalAmount - distributed;
        dividendPerToken += newDividendPerToken;
        totalPendingDividends += distributed;

        emit DividendsDistributed(amount, newDividendPerToken, dividendPerToken, msg.sender);
    }

    function claimDividends() external whenNotPaused nonReentrant notFrozen(msg.sender) {
        _validateKYC(msg.sender);
        _syncDividends(msg.sender);

        uint256 claimable = pendingDividends[msg.sender];
        if (claimable == 0) revert DREIT__NoDividendsToClaim();

        pendingDividends[msg.sender] = 0;
        totalPendingDividends -= claimable;

        stablecoin.safeTransfer(msg.sender, claimable);
        emit DividendClaimed(msg.sender, claimable);
    }

    /**
     * @notice Emergency fallback to sweep dust if redistribution failed.
     * @dev Should rarely be needed since dust is auto-redistributed in distributeDividends.
     */
    function sweepDust() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        if (dust == 0) revert DREIT__NoDividendsToClaim();

        uint256 amount = dust;
        dust = 0;

        stablecoin.safeTransfer(msg.sender, amount);
    }

    function _syncDividends(address account) internal {
        if (account == address(0)) return;

        uint256 lastClaimedValue = lastClaimed[account];
        uint256 balance = balanceOf(account);

        if (lastClaimedValue == 0) {
            if (dividendPerToken > 0 && balance > 0) {
                uint256 initialUnclaimed = (balance * dividendPerToken) / 1e18;
                if (initialUnclaimed > 0) {
                    pendingDividends[account] += initialUnclaimed;
                    totalPendingDividends += initialUnclaimed;
                    emit DividendSynced(account, initialUnclaimed);
                }
            }
            lastClaimed[account] = dividendPerToken;
            return;
        }

        if (balance == 0) {
            lastClaimed[account] = dividendPerToken;
            return;
        }

        uint256 delta = dividendPerToken - lastClaimedValue;
        if (delta == 0) return;

        uint256 unclaimed = (balance * delta) / 1e18;
        if (unclaimed > 0) {
            pendingDividends[account] += unclaimed;
            totalPendingDividends += unclaimed;
            emit DividendSynced(account, unclaimed);
        }

        lastClaimed[account] = dividendPerToken;
    }

    /**
     * @notice Validates KYC status via the identity registry.
     * @dev isVerified() in the registry already returns false if KYC is expired.
     */
    function _validateKYC(address investor) internal view {
        if (!identityRegistry.isVerified(investor)) {
            revert DREIT__KYCNotVerified(investor);
        }
    }

    function _update(address from, address to, uint256 amount) internal override whenNotPaused {
        if (from == to && from != address(0)) revert DREIT__SelfTransfer();
        if (to == address(this)) revert DREIT__SelfTransfer();

        if (from != address(0) && to != address(0)) {
            if (complianceEngine.isFrozen(from)) revert DREIT__AccountFrozen(from);
            if (complianceEngine.isFrozen(to)) revert DREIT__AccountFrozen(to);

            _validateKYC(from);
            _validateKYC(to);
            if (!complianceEngine.isCompliant(from, to, amount)) {
                revert DREIT__TransferNotCompliant(from, to);
            }

            _syncDividends(from);
            _syncDividends(to);

            super._update(from, to, amount);
            complianceEngine.transferred(from, to, amount);
        } else {
            if (from == address(0)) {
                if (lastClaimed[to] == 0 && balanceOf(to) == 0) {
                    lastClaimed[to] = dividendPerToken;
                }
            }
            super._update(from, to, amount);
        }
    }

    function setIdentityRegistry(address _registry) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(_registry) {
        if (_registry.code.length == 0) revert DREIT__NotContract(_registry);
        address oldRegistry = address(identityRegistry);
        identityRegistry = IIdentityRegistry(_registry);
        emit IdentityRegistrySet(oldRegistry, _registry, msg.sender);
    }

    function setComplianceEngine(address _engine) external onlyRole(DEFAULT_ADMIN_ROLE) nonZeroAddress(_engine) {
        if (_engine.code.length == 0) revert DREIT__NotContract(_engine);
        address oldEngine = address(complianceEngine);
        complianceEngine = IComplianceEngine(_engine);
        emit ComplianceEngineSet(oldEngine, _engine, msg.sender);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function getClaimableDividends(address account) external view returns (uint256) {
        uint256 balance = balanceOf(account);
        if (balance == 0) return pendingDividends[account];

        uint256 lastClaimedValue = lastClaimed[account];
        uint256 delta = dividendPerToken - lastClaimedValue;
        if (delta == 0) return pendingDividends[account];

        return pendingDividends[account] + ((balance * delta) / 1e18);
    }

    /**
     * @inheritdoc IDividendAware
     * @notice Exposes the total dividend liability for an account.
     * @dev Used by IdentityRegistry to block identity deletion while
     *      dividends are still owed to the investor.
     */
    function pendingDividendsOf(address account) external view returns (uint256 claimable) {
        uint256 balance = balanceOf(account);
        uint256 synced = pendingDividends[account];

        if (balance == 0) return synced;

        uint256 lastClaimedValue = lastClaimed[account];
        uint256 delta = dividendPerToken - lastClaimedValue;
        if (delta == 0) return synced;

        return synced + ((balance * delta) / 1e18);
    }
}
