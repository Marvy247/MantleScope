"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "./ui/button";

const typeColors = {
  transfer: { 
    bg: "bg-blue-500/10", 
    text: "text-blue-400", 
    border: "border-blue-500/30",
    badge: "bg-blue-500/20"
  },
  contract: { 
    bg: "bg-purple-500/10", 
    text: "text-purple-400", 
    border: "border-purple-500/30",
    badge: "bg-purple-500/20"
  },
  swap: { 
    bg: "bg-green-500/10", 
    text: "text-green-400", 
    border: "border-green-500/30",
    badge: "bg-green-500/20"
  }
};

const statusColors = {
  success: { text: "text-green-400", bg: "bg-green-500/20", icon: "✓" },
  pending: { text: "text-yellow-400", bg: "bg-yellow-500/20", icon: "⏳" },
  failed: { text: "text-red-400", bg: "bg-red-500/20", icon: "✗" }
};

export default function TransactionFeed() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  const { data: txData, isLoading } = useTransactions(itemsPerPage * page);
  const allTransactions = txData?.transactions || [];
  
  // Paginate transactions
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const transactions = allTransactions.slice(startIndex, endIndex);
  const totalPages = Math.ceil((txData?.total || 0) / itemsPerPage);

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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-5 h-5 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Live Transactions</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {txData?.total.toLocaleString() || 0} total transactions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <Activity className="w-12 h-12 mb-3 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {transactions.map((tx, index) => {
                const colors = typeColors[tx.type];
                const statusColor = statusColors[tx.status];
                
                return (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden hover:border-zinc-600 transition-all group`}
                  >
                    <div className="p-4">
                      {/* Top Row: Type Badge, Status, Time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${colors.text} uppercase px-2.5 py-1 rounded-full ${colors.badge} border ${colors.border}`}>
                            {tx.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor.bg} ${statusColor.text} font-medium`}>
                            {statusColor.icon} {tx.status}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500">{formatTime(tx.timestamp)}</span>
                      </div>

                      {/* Hash Row */}
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Hash:</span>
                        <code className="text-xs text-zinc-300 font-mono">{formatAddress(tx.hash)}</code>
                        <button
                          onClick={() => copyToClipboard(tx.hash)}
                          className="p-1 hover:bg-zinc-800 rounded transition-colors"
                        >
                          {copiedHash === tx.hash ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-500" />
                          )}
                        </button>
                      </div>
                      
                      {/* Address Flow */}
                      <div className="flex items-center gap-3 mb-3 bg-zinc-800/30 rounded-lg p-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-zinc-500 mb-1">From</div>
                          <code className="text-sm text-zinc-300 font-mono block truncate">{formatAddress(tx.from)}</code>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-zinc-500 mb-1">To</div>
                          <code className="text-sm text-zinc-300 font-mono block truncate">
                            {tx.to ? formatAddress(tx.to) : <span className="text-zinc-500 italic">Contract Deploy</span>}
                          </code>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="bg-zinc-800/30 rounded-lg p-2">
                          <div className="text-zinc-500 mb-1">Value</div>
                          <div className="text-white font-semibold truncate">{tx.value} MNT</div>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-2">
                          <div className="text-zinc-500 mb-1">Gas Used</div>
                          <div className="text-white font-semibold">{tx.gas.toLocaleString()}</div>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-2">
                          <div className="text-zinc-500 mb-1">Block</div>
                          <div className="text-white font-semibold">#{tx.blockNumber}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.a
                          href={`https://explorer.mantle.xyz/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View on Explorer
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && transactions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/30">
          <div className="text-sm text-zinc-400">
            Showing {startIndex + 1}-{Math.min(endIndex, txData?.total || 0)} of {txData?.total.toLocaleString() || 0}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
