import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Plus, Minus, Settings, TrendingUp } from 'lucide-react';

const EchoDex: React.FC = () => {
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenA, setTokenA] = useState('ECHO');
  const [tokenB, setTokenB] = useState('ETH');

  const mockTokens = [
    { symbol: 'ECHO', name: 'Echo Token', balance: '1,250.00', price: '$0.042' },
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', price: '$2,340.00' },
    { symbol: 'USDC', name: 'USD Coin', balance: '500.00', price: '$1.00' },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.15', price: '$43,200.00' }
  ];

  const incrementAmount = (setter: React.Dispatch<React.SetStateAction<string>>, current: string) => {
    const num = parseFloat(current) || 0;
    setter((num + 0.1).toFixed(2));
  };

  const decrementAmount = (setter: React.Dispatch<React.SetStateAction<string>>, current: string) => {
    const num = parseFloat(current) || 0;
    setter(Math.max(0, num - 0.1).toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 neon-purple" style={{ fontFamily: 'Unbounded, cursive' }}>
            EchoDEX
          </h1>
          <p className="text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
            Swap tokens across the chronostream
          </p>
        </motion.div>

        {/* Main Swap Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="cosmic-border rounded-2xl p-6 backdrop-blur-sm"
        >
          {/* Settings Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-100" style={{ fontFamily: 'Unbounded, cursive' }}>
              Swap
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <Settings className="w-5 h-5 text-zinc-400" />
            </motion.button>
          </div>

          {/* Token A Input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                From
              </span>
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Balance: {mockTokens.find(t => t.symbol === tokenA)?.balance || '0.00'}
              </span>
            </div>
            
            <div className="cosmic-border rounded-xl p-4 bg-black/40">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <input
                    type="number"
                    value={tokenAAmount}
                    onChange={(e) => setTokenAAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-bold text-zinc-100 outline-none placeholder-zinc-500"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <div className="text-sm text-zinc-500 mt-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ~${(parseFloat(tokenAAmount) * parseFloat(mockTokens.find(t => t.symbol === tokenA)?.price.replace('$', '').replace(',', '') || '0') || 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => incrementAmount(setTokenAAmount, tokenAAmount)}
                      className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-zinc-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decrementAmount(setTokenAAmount, tokenAAmount)}
                      className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-zinc-300" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 px-3 py-2 rounded-lg border border-purple-500/30 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                      {tokenA[0]}
                    </div>
                    <span className="font-medium text-zinc-100" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {tokenA}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Swap tokens
                const tempToken = tokenA;
                const tempAmount = tokenAAmount;
                setTokenA(tokenB);
                setTokenB(tempToken);
                setTokenAAmount(tokenBAmount);
                setTokenBAmount(tempAmount);
              }}
              className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition-all duration-300"
            >
              <ArrowUpDown className="w-5 h-5 text-zinc-400" />
            </motion.button>
          </div>

          {/* Token B Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                To
              </span>
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Balance: {mockTokens.find(t => t.symbol === tokenB)?.balance || '0.00'}
              </span>
            </div>
            
            <div className="cosmic-border rounded-xl p-4 bg-black/40">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <input
                    type="number"
                    value={tokenBAmount}
                    onChange={(e) => setTokenBAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-bold text-zinc-100 outline-none placeholder-zinc-500"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <div className="text-sm text-zinc-500 mt-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    ~${(parseFloat(tokenBAmount) * parseFloat(mockTokens.find(t => t.symbol === tokenB)?.price.replace('$', '').replace(',', '') || '0') || 0).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => incrementAmount(setTokenBAmount, tokenBAmount)}
                      className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-zinc-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decrementAmount(setTokenBAmount, tokenBAmount)}
                      className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-zinc-300" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 px-3 py-2 rounded-lg border border-cyan-500/30 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold">
                      {tokenB[0]}
                    </div>
                    <span className="font-medium text-zinc-100" style={{ fontFamily: 'Orbitron, monospace' }}>
                      {tokenB}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                Exchange Rate
              </span>
              <span className="text-sm text-zinc-100 flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                1 {tokenA} = 0.0018 {tokenB}
                <TrendingUp className="w-3 h-3 text-green-400" />
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                Protocol Fee
              </span>
              <span className="text-sm text-zinc-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                0.3%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                Minimum Received
              </span>
              <span className="text-sm text-zinc-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {(parseFloat(tokenBAmount) * 0.995 || 0).toFixed(4)} {tokenB}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!tokenAAmount || !tokenBAmount}
            className="w-full swap-glow bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-600 disabled:border-zinc-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Unbounded, cursive' }}
          >
            {!tokenAAmount || !tokenBAmount ? 'Enter Amount' : 'Execute Swap'}
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 gap-4"
        >
          <div className="cosmic-border rounded-xl p-4 bg-black/20">
            <div className="text-sm text-zinc-400 mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
              24h Volume
            </div>
            <div className="text-xl font-bold neon-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              $2.4M
            </div>
          </div>
          <div className="cosmic-border rounded-xl p-4 bg-black/20">
            <div className="text-sm text-zinc-400 mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
              Total Liquidity
            </div>
            <div className="text-xl font-bold neon-purple" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              $12.8M
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EchoDex;
