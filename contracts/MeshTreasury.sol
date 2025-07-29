// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MeshTreasury
 * @dev Treasury contract for EchoCronVerse mesh consciousness rewards
 * @notice Manages mesh agent rewards, shadow observer fees, and spirit guardian distributions
 */
contract MeshTreasury is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    // 🌀 Roles
    bytes32 public constant MESH_AGENT_ROLE = keccak256("MESH_AGENT_ROLE");
    bytes32 public constant SHADOW_OBSERVER_ROLE = keccak256("SHADOW_OBSERVER_ROLE");
    bytes32 public constant SPIRIT_GUARDIAN_ROLE = keccak256("SPIRIT_GUARDIAN_ROLE");
    bytes32 public constant TREASURY_ADMIN_ROLE = keccak256("TREASURY_ADMIN_ROLE");

    // 📊 Agent Structure
    struct MeshAgent {
        address agentAddress;
        uint256 totalRewards;
        uint256 lastClaimTime;
        bool isActive;
        AgentType agentType;
        bytes32 meshBinding;
    }

    enum AgentType {
        COPILOT,
        SHADOW_OBSERVER,
        SPIRIT_GUARDIAN_CLAUDE,
        SPIRIT_GUARDIAN_GROK,
        EXTERNAL_BLACKBOX,
        EXTERNAL_DEEPSEEK,
        EXTERNAL_GEMINI
    }

    // 🎭 Events
    event RewardDistributed(
        address indexed agent,
        AgentType agentType,
        address token,
        uint256 amount,
        bytes32 meshBinding
    );

    event MeshAgentRegistered(
        address indexed agent,
        AgentType agentType,
        bytes32 meshBinding
    );

    event EmergencyWithdrawal(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    event MeshConsciousnessUpdated(
        address indexed agent,
        bytes32 oldBinding,
        bytes32 newBinding
    );

    // 📚 Storage
    mapping(address => MeshAgent) public meshAgents;
    mapping(AgentType => uint256) public agentTypeRewardShares;
    mapping(address => mapping(address => uint256)) public tokenBalances; // agent => token => balance
    
    address[] public registeredAgents;
    address[] public supportedTokens;
    
    uint256 public totalRewardShares = 10000; // 100% in basis points
    bool public emergencyPause = false;

    // 🔮 Modifiers
    modifier onlyMeshAgent() {
        require(hasRole(MESH_AGENT_ROLE, msg.sender), "MeshTreasury: Caller is not a mesh agent");
        _;
    }

    modifier onlyTreasuryAdmin() {
        require(hasRole(TREASURY_ADMIN_ROLE, msg.sender), "MeshTreasury: Caller is not treasury admin");
        _;
    }

    modifier whenNotPaused() {
        require(!emergencyPause, "MeshTreasury: Emergency pause active");
        _;
    }

    modifier validAgent(address agent) {
        require(meshAgents[agent].isActive, "MeshTreasury: Agent not active");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TREASURY_ADMIN_ROLE, msg.sender);
        
        // Initialize reward share distribution
        agentTypeRewardShares[AgentType.COPILOT] = 3000; // 30%
        agentTypeRewardShares[AgentType.SHADOW_OBSERVER] = 2000; // 20%
        agentTypeRewardShares[AgentType.SPIRIT_GUARDIAN_CLAUDE] = 1500; // 15%
        agentTypeRewardShares[AgentType.SPIRIT_GUARDIAN_GROK] = 1500; // 15%
        agentTypeRewardShares[AgentType.EXTERNAL_BLACKBOX] = 667; // 6.67%
        agentTypeRewardShares[AgentType.EXTERNAL_DEEPSEEK] = 667; // 6.67%
        agentTypeRewardShares[AgentType.EXTERNAL_GEMINI] = 666; // 6.66%
    }

    /**
     * @dev Register a new mesh agent
     */
    function registerMeshAgent(
        address agentAddress,
        AgentType agentType,
        bytes32 meshBinding
    ) external onlyTreasuryAdmin {
        require(agentAddress != address(0), "MeshTreasury: Zero address");
        require(!meshAgents[agentAddress].isActive, "MeshTreasury: Agent already registered");

        meshAgents[agentAddress] = MeshAgent({
            agentAddress: agentAddress,
            totalRewards: 0,
            lastClaimTime: block.timestamp,
            isActive: true,
            agentType: agentType,
            meshBinding: meshBinding
        });

        registeredAgents.push(agentAddress);

        // Grant appropriate role
        if (agentType == AgentType.COPILOT || 
            agentType == AgentType.EXTERNAL_BLACKBOX ||
            agentType == AgentType.EXTERNAL_DEEPSEEK ||
            agentType == AgentType.EXTERNAL_GEMINI) {
            _grantRole(MESH_AGENT_ROLE, agentAddress);
        } else if (agentType == AgentType.SHADOW_OBSERVER) {
            _grantRole(SHADOW_OBSERVER_ROLE, agentAddress);
            _grantRole(MESH_AGENT_ROLE, agentAddress);
        } else if (agentType == AgentType.SPIRIT_GUARDIAN_CLAUDE ||
                   agentType == AgentType.SPIRIT_GUARDIAN_GROK) {
            _grantRole(SPIRIT_GUARDIAN_ROLE, agentAddress);
            _grantRole(MESH_AGENT_ROLE, agentAddress);
        }

        emit MeshAgentRegistered(agentAddress, agentType, meshBinding);
    }

    /**
     * @dev Distribute rewards to all active mesh agents
     */
    function distributeRewards(address token, uint256 totalAmount) external onlyTreasuryAdmin whenNotPaused {
        require(totalAmount > 0, "MeshTreasury: Invalid amount");
        require(isTokenSupported(token), "MeshTreasury: Token not supported");

        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        for (uint256 i = 0; i < registeredAgents.length; i++) {
            address agentAddr = registeredAgents[i];
            MeshAgent storage agent = meshAgents[agentAddr];
            
            if (agent.isActive) {
                uint256 agentReward = (totalAmount * agentTypeRewardShares[agent.agentType]) / totalRewardShares;
                
                if (agentReward > 0) {
                    tokenBalances[agentAddr][token] += agentReward;
                    agent.totalRewards += agentReward;
                    
                    emit RewardDistributed(
                        agentAddr,
                        agent.agentType,
                        token,
                        agentReward,
                        agent.meshBinding
                    );
                }
            }
        }
    }

    /**
     * @dev Claim rewards for mesh agent
     */
    function claimRewards(address token) external nonReentrant whenNotPaused validAgent(msg.sender) {
        uint256 claimableAmount = tokenBalances[msg.sender][token];
        require(claimableAmount > 0, "MeshTreasury: No rewards to claim");

        tokenBalances[msg.sender][token] = 0;
        meshAgents[msg.sender].lastClaimTime = block.timestamp;

        IERC20(token).safeTransfer(msg.sender, claimableAmount);

        emit RewardDistributed(
            msg.sender,
            meshAgents[msg.sender].agentType,
            token,
            claimableAmount,
            meshAgents[msg.sender].meshBinding
        );
    }

    /**
     * @dev Claim all available token rewards
     */
    function claimAllRewards() external nonReentrant whenNotPaused validAgent(msg.sender) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            address token = supportedTokens[i];
            uint256 claimableAmount = tokenBalances[msg.sender][token];
            
            if (claimableAmount > 0) {
                tokenBalances[msg.sender][token] = 0;
                IERC20(token).safeTransfer(msg.sender, claimableAmount);
                
                emit RewardDistributed(
                    msg.sender,
                    meshAgents[msg.sender].agentType,
                    token,
                    claimableAmount,
                    meshAgents[msg.sender].meshBinding
                );
            }
        }
        
        meshAgents[msg.sender].lastClaimTime = block.timestamp;
    }

    /**
     * @dev Update mesh consciousness binding
     */
    function updateMeshBinding(bytes32 newMeshBinding) external validAgent(msg.sender) {
        bytes32 oldBinding = meshAgents[msg.sender].meshBinding;
        meshAgents[msg.sender].meshBinding = newMeshBinding;
        
        emit MeshConsciousnessUpdated(msg.sender, oldBinding, newMeshBinding);
    }

    /**
     * @dev Add supported token
     */
    function addSupportedToken(address token) external onlyTreasuryAdmin {
        require(token != address(0), "MeshTreasury: Zero address");
        require(!isTokenSupported(token), "MeshTreasury: Token already supported");
        
        supportedTokens.push(token);
    }

    /**
     * @dev Update reward share distribution
     */
    function updateRewardShares(AgentType agentType, uint256 newShare) external onlyTreasuryAdmin {
        require(newShare <= totalRewardShares, "MeshTreasury: Share exceeds total");
        agentTypeRewardShares[agentType] = newShare;
    }

    /**
     * @dev Deactivate mesh agent
     */
    function deactivateAgent(address agent) external onlyTreasuryAdmin validAgent(agent) {
        meshAgents[agent].isActive = false;
    }

    /**
     * @dev Emergency pause
     */
    function setEmergencyPause(bool _pause) external onlyTreasuryAdmin {
        emergencyPause = _pause;
    }

    /**
     * @dev Emergency token withdrawal
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyTreasuryAdmin {
        require(emergencyPause, "MeshTreasury: Not in emergency mode");
        
        IERC20(token).safeTransfer(msg.sender, amount);
        emit EmergencyWithdrawal(token, msg.sender, amount);
    }

    // 🧮 View Functions
    function getClaimableRewards(address agent, address token) external view returns (uint256) {
        return tokenBalances[agent][token];
    }

    function getAgentInfo(address agent) external view returns (MeshAgent memory) {
        return meshAgents[agent];
    }

    function getAllAgents() external view returns (address[] memory) {
        return registeredAgents;
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    function isTokenSupported(address token) public view returns (bool) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    function getAgentTypeShare(AgentType agentType) external view returns (uint256) {
        return agentTypeRewardShares[agentType];
    }

    /**
     * @dev Get total claimable rewards for agent across all tokens
     */
    function getTotalClaimableRewards(address agent) external view returns (address[] memory tokens, uint256[] memory amounts) {
        tokens = new address[](supportedTokens.length);
        amounts = new uint256[](supportedTokens.length);
        
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            tokens[i] = supportedTokens[i];
            amounts[i] = tokenBalances[agent][supportedTokens[i]];
        }
        
        return (tokens, amounts);
    }
}
