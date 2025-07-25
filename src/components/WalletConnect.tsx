import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Link, Unlink, Copy, ExternalLink, Shield, Zap, ChevronDown } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<WalletOption | null>(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '📱',
      description: 'Connect with mobile wallet apps'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase Wallet'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Connect using Phantom wallet'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect using Trust Wallet'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: '🌈',
      description: 'Connect using Rainbow wallet'
    }
  ];

  const mockConnect = (wallet: WalletOption) => {
    // Simulate connection delay
    setTimeout(() => {
      setConnectedWallet(wallet);
      setAddress('0x742d35...4f8C');
      setBalance('2.45 ETH');
      setIsConnected(true);
      setShowModal(false);
    }, 1000 + Math.random() * 2000);
  };

  const disconnect = () => {
    setIsConnected(false);
    setConnectedWallet(null);
    setAddress('');
    setBalance('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6Db34Ab87DC0b8A1d14739d5a4f8C');
    // Could add toast notification here
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900/20 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 neon-purple" />
            <h1 className="text-4xl font-bold neon-purple" style={{ fontFamily: 'Unbounded, cursive' }}>
              Wallet Portal
            </h1>
          </div>
          <p className="text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
            Connect your wallet to access the Echocronverse
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cosmic-border rounded-2xl p-6 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-zinc-100 mb-6" style={{ fontFamily: 'Unbounded, cursive' }}>
              Connection Status
            </h2>

            {!isConnected ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-400 mb-6" style={{ fontFamily: 'Orbitron, monospace' }}>
                  No wallet connected
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="wallet-glow bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                  style={{ fontFamily: 'Unbounded, cursive' }}
                >
                  <Link className="w-5 h-5" />
                  Connect Wallet
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="text-2xl">{connectedWallet?.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {connectedWallet?.name}
                    </div>
                    <div className="text-sm text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      Connected
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                    <span className="text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                      Address
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {shortenAddress(address)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={copyAddress}
                        className="p-1 rounded hover:bg-zinc-700 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-zinc-400" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                    <span className="text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                      Balance
                    </span>
                    <span className="text-zinc-100 font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {balance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                    <span className="text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                      Network
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-zinc-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Ethereum Mainnet
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={disconnect}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Unlink className="w-4 h-4" />
                  Disconnect
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Features & Security */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Security Features */}
            <div className="cosmic-border rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-zinc-100 mb-4" style={{ fontFamily: 'Unbounded, cursive' }}>
                Security Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    End-to-end encryption
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Multi-signature support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link className="w-5 h-5 text-purple-400" />
                  <span className="text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Decentralized connection
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="cosmic-border rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-zinc-100 mb-4" style={{ fontFamily: 'Unbounded, cursive' }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isConnected}
                  className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="text-lg mb-1">💰</div>
                  <div className="text-sm font-medium text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    View Assets
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isConnected}
                  className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="text-lg mb-1">📊</div>
                  <div className="text-sm font-medium text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Transaction History
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isConnected}
                  className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="text-lg mb-1">⚙️</div>
                  <div className="text-sm font-medium text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Settings
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isConnected}
                  className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <div className="text-lg mb-1">🔗</div>
                  <div className="text-sm font-medium text-zinc-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Export
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wallet Selection Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="cosmic-border rounded-2xl p-6 w-full max-w-md backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: 'Unbounded, cursive' }}>
                    Choose Wallet
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-2">
                  {walletOptions.map((wallet, index) => (
                    <motion.button
                      key={wallet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => mockConnect(wallet)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-left"
                    >
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-zinc-100" style={{ fontFamily: 'Orbitron, monospace' }}>
                            {wallet.name}
                          </div>
                          {wallet.popular && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {wallet.description}
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-zinc-400 rotate-[-90deg]" />
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-400 mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                        Secure Connection
                      </div>
                      <div className="text-xs text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Your wallet information is encrypted and never stored on our servers.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WalletConnect;
