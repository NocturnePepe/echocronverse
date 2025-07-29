// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CronoRouter
 * @dev Advanced routing system for EchoCronVerse DEX
 * @notice Multi-hop swaps with mesh consciousness optimization
 */
contract CronoRouter is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // 🌀 Core Contracts
    address public immutable swapCore;
    address public immutable meshTreasury;
    
    // 📊 Route Structure
    struct SwapRoute {
        bytes32[] poolIds;
        address[] tokens;
        uint256[] amounts;
        bytes32 meshOptimization; // AI-optimized routing
    }

    // 🎭 Events
    event RouteExecuted(
        address indexed trader,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        bytes32[] poolIds,
        bytes32 meshOptimization
    );

    event OptimalRouteCalculated(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        bytes32[] optimalPoolIds,
        uint256 expectedOutput
    );

    // 🔮 Modifiers
    modifier validRoute(SwapRoute memory route) {
        require(route.poolIds.length > 0, "CronoRouter: Empty route");
        require(route.tokens.length == route.poolIds.length + 1, "CronoRouter: Invalid route structure");
        _;
    }

    constructor(address _swapCore, address _meshTreasury) {
        swapCore = _swapCore;
        meshTreasury = _meshTreasury;
    }

    /**
     * @dev Execute multi-hop swap with mesh optimization
     */
    function executeSwapRoute(
        SwapRoute memory route,
        uint256 amountIn,
        uint256 minAmountOut,
        address to,
        uint256 deadline
    ) external nonReentrant validRoute(route) returns (uint256 amountOut) {
        require(block.timestamp <= deadline, "CronoRouter: Transaction expired");
        require(amountIn > 0, "CronoRouter: Invalid input amount");

        address tokenIn = route.tokens[0];
        address tokenOut = route.tokens[route.tokens.length - 1];

        // Transfer input tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        uint256 currentAmount = amountIn;
        address currentToken = tokenIn;

        // Execute each hop in the route
        for (uint256 i = 0; i < route.poolIds.length; i++) {
            address nextToken = route.tokens[i + 1];
            uint256 minHopOutput = (i == route.poolIds.length - 1) ? minAmountOut : 0;

            // Approve swap core to spend tokens
            IERC20(currentToken).safeApprove(swapCore, currentAmount);

            // Execute swap
            currentAmount = IEchodexSwapCore(swapCore).swapTokens(
                route.poolIds[i],
                currentToken,
                currentAmount,
                minHopOutput,
                (i == route.poolIds.length - 1) ? to : address(this)
            );

            currentToken = nextToken;
        }

        amountOut = currentAmount;
        require(amountOut >= minAmountOut, "CronoRouter: Insufficient output amount");

        emit RouteExecuted(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            route.poolIds,
            route.meshOptimization
        );

        return amountOut;
    }

    /**
     * @dev Calculate optimal route using mesh consciousness
     */
    function calculateOptimalRoute(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (SwapRoute memory optimalRoute, uint256 expectedOutput) {
        // This would integrate with mesh AI for route optimization
        // For now, return a basic direct route structure
        
        bytes32[] memory pools = IEchodexSwapCore(swapCore).getAllPools();
        bytes32 directPool = findDirectPool(tokenIn, tokenOut, pools);
        
        if (directPool != bytes32(0)) {
            // Direct route found
            bytes32[] memory poolIds = new bytes32[](1);
            address[] memory tokens = new address[](2);
            uint256[] memory amounts = new uint256[](2);
            
            poolIds[0] = directPool;
            tokens[0] = tokenIn;
            tokens[1] = tokenOut;
            amounts[0] = amountIn;
            
            // Calculate expected output
            (uint256 reserveIn, uint256 reserveOut) = getPoolReserves(directPool, tokenIn, tokenOut);
            expectedOutput = IEchodexSwapCore(swapCore).getAmountOut(amountIn, reserveIn, reserveOut);
            amounts[1] = expectedOutput;
            
            optimalRoute = SwapRoute({
                poolIds: poolIds,
                tokens: tokens,
                amounts: amounts,
                meshOptimization: keccak256(abi.encodePacked("direct_route", block.timestamp))
            });
        } else {
            // Multi-hop route needed (simplified for demo)
            revert("CronoRouter: No direct route found - multi-hop not implemented yet");
        }

        return (optimalRoute, expectedOutput);
    }

    /**
     * @dev Get quote for token swap
     */
    function getAmountsOut(
        uint256 amountIn,
        address[] calldata path
    ) external view returns (uint256[] memory amounts) {
        require(path.length >= 2, "CronoRouter: Invalid path");
        
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        
        for (uint256 i = 0; i < path.length - 1; i++) {
            bytes32[] memory pools = IEchodexSwapCore(swapCore).getAllPools();
            bytes32 poolId = findDirectPool(path[i], path[i + 1], pools);
            require(poolId != bytes32(0), "CronoRouter: Pool not found");
            
            (uint256 reserveIn, uint256 reserveOut) = getPoolReserves(poolId, path[i], path[i + 1]);
            amounts[i + 1] = IEchodexSwapCore(swapCore).getAmountOut(amounts[i], reserveIn, reserveOut);
        }
        
        return amounts;
    }

    /**
     * @dev Emergency token recovery (owner only)
     */
    function recoverTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    // 🔧 Internal Functions
    function findDirectPool(
        address tokenA,
        address tokenB,
        bytes32[] memory pools
    ) internal view returns (bytes32) {
        for (uint256 i = 0; i < pools.length; i++) {
            IEchodexSwapCore.LiquidityPool memory pool = IEchodexSwapCore(swapCore).getPoolInfo(pools[i]);
            if ((pool.tokenA == tokenA && pool.tokenB == tokenB) ||
                (pool.tokenA == tokenB && pool.tokenB == tokenA)) {
                return pools[i];
            }
        }
        return bytes32(0);
    }

    function getPoolReserves(
        bytes32 poolId,
        address tokenA,
        address tokenB
    ) internal view returns (uint256 reserveA, uint256 reserveB) {
        IEchodexSwapCore.LiquidityPool memory pool = IEchodexSwapCore(swapCore).getPoolInfo(poolId);
        
        if (pool.tokenA == tokenA) {
            return (pool.reserveA, pool.reserveB);
        } else {
            return (pool.reserveB, pool.reserveA);
        }
    }
}

// Interface for EchodexSwapCore
interface IEchodexSwapCore {
    struct LiquidityPool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        uint256 lastUpdateBlock;
        bool isActive;
        bytes32 meshBindingHash;
    }

    function swapTokens(
        bytes32 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        address to
    ) external returns (uint256 amountOut);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256);

    function getPoolInfo(bytes32 poolId) external view returns (LiquidityPool memory);
    
    function getAllPools() external view returns (bytes32[] memory);
}
