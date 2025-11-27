"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  timestamp: number;
  type: "transfer" | "contract" | "swap";
}

const generateMockTransaction = (): Transaction => {
  const types: Transaction["type"][] = ["transfer", "contract", "swap"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    from: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    to: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    value: (Math.random() * 10).toFixed(4),
    gas: (Math.random() * 0.1).toFixed(6),
    timestamp: Date.now(),
    type
  };
};

const typeColors = {
  transfer: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  contract: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  swap: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" }
};

export default function TransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize with some transactions
    const initial = Array.from({ length: 5 }, () => generateMockTransaction());
    setTransactions(initial);

    // Add new transaction every 2-4 seconds
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = generateMockTransaction();
        return [newTx, ...prev].slice(0, 10);
      });
    }, Math.random() * 2000 + 2000);

    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Live Transaction Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-zinc-400">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        <AnimatePresence mode="popLayout">
          {transactions.map((tx) => {
            const colors = typeColors[tx.type];
            
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`${colors.bg} border ${colors.border} rounded-lg p-4 hover:border-zinc-600 transition-colors group`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold ${colors.text} uppercase px-2 py-0.5 rounded-full ${colors.bg} border ${colors.border}`}>
                        {tx.type}
                      </span>
                      <span className="text-xs text-zinc-500">{formatTime(tx.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <code className="text-zinc-400">{formatAddress(tx.from)}</code>
                      <ArrowRight className="w-3 h-3 text-zinc-600" />
                      <code className="text-zinc-400">{formatAddress(tx.to)}</code>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500">Value: </span>
                        <span className="text-white font-medium">{tx.value} MNT</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Gas: </span>
                        <span className="text-white font-medium">{tx.gas} GWEI</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
