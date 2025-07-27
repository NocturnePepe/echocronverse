import React from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { Shield, Copy, ExternalLink, Wallet } from 'lucide-react';
import { FrameRunes } from './runes';
import { EmberParticles } from './ui';

// Phase 6.3 Web3 Foundation - Wallet Connection Portal

const WalletConnect: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900/20 to-black p-6 relative">
      <EmberParticles variant="mystical" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <FrameRunes tier="master" runeSet="shadow" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center p-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold text-purple-400" style={{ fontFamily: 'Unbounded, cursive' }}>
                Wallet Portal
              </h1>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-zinc-300 text-lg">
              ⟐ Secure gateway to the Echocronverse ⟐
            </p>
          </motion.div>
        </FrameRunes>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              Connection Status
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isConnected 
                ? 'bg-green-600/20 text-green-400 border border-green-400/30' 
                : 'bg-red-600/20 text-red-400 border border-red-400/30'
            }`}>
              {isConnected ? '⚡ Connected' : '⚫ Disconnected'}
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <motion.button
                            onClick={openConnectModal}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ⟐ Connect Wallet ⟐
                          </motion.button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <motion.button
                            onClick={openChainModal}
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Wrong network
                          </motion.button>
                        );
                      }

                      return (
                        <div className="flex gap-3">
                          <motion.button
                            onClick={openChainModal}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </motion.button>

                          <motion.button
                            onClick={openAccountModal}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                          </motion.button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {isConnected && address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Address:</span>
                  <button
                    onClick={copyAddress}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="text-white font-mono text-sm">
                  {shortenAddress(address)}
                </div>
              </div>

              {balance && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <span className="text-gray-400 text-sm block mb-2">Balance:</span>
                  <div className="text-white font-semibold">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </div>
                </div>
              )}

              {chain && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <span className="text-gray-400 text-sm block mb-2">Network:</span>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {chain.name}
                    {chain.blockExplorers?.default && (
                      <a
                        href={`${chain.blockExplorers.default.url}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-yellow-600/10 border border-yellow-400/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-400 font-semibold text-sm mb-1">Security Notice</h3>
              <p className="text-yellow-300/80 text-sm">
                Your wallet connection is secured by industry-standard encryption. 
                Never share your private keys or seed phrases with anyone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletConnect;
