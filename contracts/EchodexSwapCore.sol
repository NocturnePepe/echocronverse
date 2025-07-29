// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EchodexSwapCore
 * @dev Core DEX functionality for EchoCronVerse
 * @notice Mystical trading engine with mesh consciousness integration
 */
contract EchodexSwapCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // 🌀 Mystical Constants
    uint256 public constant MESH_FEE_BASIS_POINTS = 25; // 0.25% mesh fee
    uint256 public constant SHADOW_OBSERVER_FEE = 5;    // 0.05% shadow observer fee
    uint256 public constant BASIS_POINTS_TOTAL = 10000;
    
    // 📊 Pool Structure
    struct LiquidityPool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        uint256 lastUpdateBlock;
        bool isActive;
        bytes32 meshBindingHash; // Mystical binding to mesh consciousness
    }

    // 🎭 Events
    event PoolCreated(
        bytes32 indexed poolId,
        address indexed tokenA,
        address indexed tokenB,
        uint256 initialLiquidityA,
        uint256 initialLiquidityB
    );
    
    event SwapExecuted(
        bytes32 indexed poolId,
        address indexed trader,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 meshFee
    );
    
    event LiquidityAdded(
        bytes32 indexed poolId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityMinted
    );

    event LiquidityRemoved(
        bytes32 indexed poolId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityBurned
    );

    event MeshConsciousnessUpdated(
        bytes32 indexed poolId,
        bytes32 newMeshBinding
    );

    // 📚 Storage
    mapping(bytes32 => LiquidityPool) public pools;
    mapping(bytes32 => mapping(address => uint256)) public liquidityProviders;
    mapping(address => bool) public authorizedMeshAgents;
    
    bytes32[] public allPoolIds;
    address public meshTreasuryAddress;
    address public shadowObserverAddress;
    
    bool public emergencyPause = false;

    // 🔮 Modifiers
    modifier onlyMeshAgent() {
        require(authorizedMeshAgents[msg.sender], "EchodexSwap: Unauthorized mesh agent");
        _;
    }

    modifier whenNotPaused() {
        require(!emergencyPause, "EchodexSwap: Emergency pause active");
        _;
    }

    modifier validPool(bytes32 poolId) {
        require(pools[poolId].isActive, "EchodexSwap: Pool not active");
        _;
    }

    constructor(
        address _meshTreasuryAddress,
        address _shadowObserverAddress
    ) {
        meshTreasuryAddress = _meshTreasuryAddress;
        shadowObserverAddress = _shadowObserverAddress;
        authorizedMeshAgents[msg.sender] = true;
    }

    /**
     * @dev Create a new liquidity pool with mystical binding
     */
    function createPool(
        address tokenA,
        address tokenB,
        uint256 initialLiquidityA,
        uint256 initialLiquidityB,
        bytes32 meshBinding
    ) external nonReentrant returns (bytes32 poolId) {
        require(tokenA != tokenB, "EchodexSwap: Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "EchodexSwap: Zero address");
        require(initialLiquidityA > 0 && initialLiquidityB > 0, "EchodexSwap: Insufficient liquidity");

        // Generate pool ID
        poolId = keccak256(abi.encodePacked(tokenA, tokenB, block.timestamp));
        require(!pools[poolId].isActive, "EchodexSwap: Pool already exists");

        // Transfer tokens
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), initialLiquidityA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), initialLiquidityB);

        // Calculate initial liquidity
        uint256 totalLiquidity = sqrt(initialLiquidityA * initialLiquidityB);

        // Create pool
        pools[poolId] = LiquidityPool({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: initialLiquidityA,
            reserveB: initialLiquidityB,
            totalLiquidity: totalLiquidity,
            lastUpdateBlock: block.number,
            isActive: true,
            meshBindingHash: meshBinding
        });

        // Track liquidity provider
        liquidityProviders[poolId][msg.sender] = totalLiquidity;
        allPoolIds.push(poolId);

        emit PoolCreated(poolId, tokenA, tokenB, initialLiquidityA, initialLiquidityB);
        emit MeshConsciousnessUpdated(poolId, meshBinding);

        return poolId;
    }

    /**
     * @dev Execute swap with mesh consciousness validation
     */
    function swapTokens(
        bytes32 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        address to
    ) external nonReentrant whenNotPaused validPool(poolId) returns (uint256 amountOut) {
        LiquidityPool storage pool = pools[poolId];
        require(tokenIn == pool.tokenA || tokenIn == pool.tokenB, "EchodexSwap: Invalid token");
        require(amountIn > 0, "EchodexSwap: Invalid amount");

        bool isTokenA = (tokenIn == pool.tokenA);
        (uint256 reserveIn, uint256 reserveOut) = isTokenA 
            ? (pool.reserveA, pool.reserveB) 
            : (pool.reserveB, pool.reserveA);

        address tokenOut = isTokenA ? pool.tokenB : pool.tokenA;

        // Calculate output amount with fees
        uint256 meshFee = (amountIn * MESH_FEE_BASIS_POINTS) / BASIS_POINTS_TOTAL;
        uint256 shadowFee = (amountIn * SHADOW_OBSERVER_FEE) / BASIS_POINTS_TOTAL;
        uint256 amountInAfterFees = amountIn - meshFee - shadowFee;

        amountOut = getAmountOut(amountInAfterFees, reserveIn, reserveOut);
        require(amountOut >= minAmountOut, "EchodexSwap: Insufficient output amount");
        require(amountOut < reserveOut, "EchodexSwap: Insufficient liquidity");

        // Transfer input token
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Distribute fees
        IERC20(tokenIn).safeTransfer(meshTreasuryAddress, meshFee);
        IERC20(tokenIn).safeTransfer(shadowObserverAddress, shadowFee);

        // Transfer output token
        IERC20(tokenOut).safeTransfer(to, amountOut);

        // Update reserves
        if (isTokenA) {
            pool.reserveA += amountInAfterFees;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountInAfterFees;
            pool.reserveA -= amountOut;
        }

        pool.lastUpdateBlock = block.number;

        emit SwapExecuted(poolId, msg.sender, tokenIn, tokenOut, amountIn, amountOut, meshFee + shadowFee);

        return amountOut;
    }

    /**
     * @dev Add liquidity to existing pool
     */
    function addLiquidity(
        bytes32 poolId,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant whenNotPaused validPool(poolId) returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        LiquidityPool storage pool = pools[poolId];

        (amountA, amountB) = calculateOptimalAmounts(
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            pool.reserveA,
            pool.reserveB
        );

        liquidity = min(
            (amountA * pool.totalLiquidity) / pool.reserveA,
            (amountB * pool.totalLiquidity) / pool.reserveB
        );

        require(liquidity > 0, "EchodexSwap: Insufficient liquidity minted");

        // Transfer tokens
        IERC20(pool.tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(pool.tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        // Update pool state
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        pool.totalLiquidity += liquidity;
        pool.lastUpdateBlock = block.number;

        // Update provider balance
        liquidityProviders[poolId][msg.sender] += liquidity;

        emit LiquidityAdded(poolId, msg.sender, amountA, amountB, liquidity);

        return (amountA, amountB, liquidity);
    }

    /**
     * @dev Remove liquidity from pool
     */
    function removeLiquidity(
        bytes32 poolId,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin
    ) external nonReentrant validPool(poolId) returns (uint256 amountA, uint256 amountB) {
        LiquidityPool storage pool = pools[poolId];
        require(liquidityProviders[poolId][msg.sender] >= liquidity, "EchodexSwap: Insufficient liquidity");

        amountA = (liquidity * pool.reserveA) / pool.totalLiquidity;
        amountB = (liquidity * pool.reserveB) / pool.totalLiquidity;

        require(amountA >= amountAMin && amountB >= amountBMin, "EchodexSwap: Insufficient amounts");

        // Update provider balance
        liquidityProviders[poolId][msg.sender] -= liquidity;

        // Update pool state
        pool.reserveA -= amountA;
        pool.reserveB -= amountB;
        pool.totalLiquidity -= liquidity;
        pool.lastUpdateBlock = block.number;

        // Transfer tokens
        IERC20(pool.tokenA).safeTransfer(msg.sender, amountA);
        IERC20(pool.tokenB).safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(poolId, msg.sender, amountA, amountB, liquidity);

        return (amountA, amountB);
    }

    /**
     * @dev Update mesh consciousness binding (mesh agents only)
     */
    function updateMeshBinding(bytes32 poolId, bytes32 newMeshBinding) external onlyMeshAgent validPool(poolId) {
        pools[poolId].meshBindingHash = newMeshBinding;
        emit MeshConsciousnessUpdated(poolId, newMeshBinding);
    }

    /**
     * @dev Emergency pause (owner only)
     */
    function setEmergencyPause(bool _pause) external onlyOwner {
        emergencyPause = _pause;
    }

    /**
     * @dev Authorize mesh agent
     */
    function authorizeMeshAgent(address agent, bool authorized) external onlyOwner {
        authorizedMeshAgents[agent] = authorized;
    }

    // 🧮 View Functions
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256) {
        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "EchodexSwap: Invalid reserves");
        
        uint256 numerator = amountIn * reserveOut;
        uint256 denominator = reserveIn + amountIn;
        
        return numerator / denominator;
    }

    function getPoolInfo(bytes32 poolId) external view returns (LiquidityPool memory) {
        return pools[poolId];
    }

    function getUserLiquidity(bytes32 poolId, address user) external view returns (uint256) {
        return liquidityProviders[poolId][user];
    }

    function getAllPools() external view returns (bytes32[] memory) {
        return allPoolIds;
    }

    // 🔧 Internal Functions
    function calculateOptimalAmounts(
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        uint256 reserveA,
        uint256 reserveB
    ) internal pure returns (uint256 amountA, uint256 amountB) {
        if (reserveA == 0 && reserveB == 0) {
            return (amountADesired, amountBDesired);
        }
        
        uint256 amountBOptimal = (amountADesired * reserveB) / reserveA;
        if (amountBOptimal <= amountBDesired) {
            require(amountBOptimal >= amountBMin, "EchodexSwap: Insufficient B amount");
            return (amountADesired, amountBOptimal);
        }
        
        uint256 amountAOptimal = (amountBDesired * reserveA) / reserveB;
        require(amountAOptimal <= amountADesired && amountAOptimal >= amountAMin, "EchodexSwap: Insufficient A amount");
        return (amountAOptimal, amountBDesired);
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
