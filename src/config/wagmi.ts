import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, arbitrum, base, optimism, polygon } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Echocronverse',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'your_project_id',
  chains: [
    mainnet,
    sepolia, // Testnet for development
    arbitrum,
    base,
    optimism,
    polygon,
  ],
  ssr: false, // If using Next.js, set to true
});

// Contract addresses for different networks
export const CONTRACTS = {
  [mainnet.id]: {
    ECHO_TOKEN: '0x0000000000000000000000000000000000000000', // Replace with actual
    ECHODEX: '0x0000000000000000000000000000000000000000', // Replace with actual
    MEMORY_NFT: '0x0000000000000000000000000000000000000000', // Replace with actual
  },
  [sepolia.id]: {
    ECHO_TOKEN: '0x0000000000000000000000000000000000000000', // Test contract
    ECHODEX: '0x0000000000000000000000000000000000000000', // Test contract  
    MEMORY_NFT: '0x0000000000000000000000000000000000000000', // Test contract
  },
};

// Supported networks for the Echocronverse
export const SUPPORTED_CHAINS = [mainnet, sepolia, arbitrum, base, optimism, polygon];
