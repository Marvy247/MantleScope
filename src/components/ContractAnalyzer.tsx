"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, AlertTriangle, CheckCircle2, Zap, Code2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ContractAnalysis {
  address: string;
  isContract: boolean;
  codeSize: number;
  balance: string;
  transactionCount: number;
  analysis: {
    hasProxy: boolean;
    hasUpgradeable: boolean;
    hasReentrancyGuard: boolean;
    hasPausable: boolean;
    hasOwnable: boolean;
    estimatedComplexity: "low" | "medium" | "high";
    gasOptimizationScore: number;
    features: string[];
    risks: string[];
    recommendations: string[];
  };
  recentTransactions: number;
}

interface ContractAnalyzerProps {
  initialAddress?: string;
  onClearAddress?: () => void;
}

export default function ContractAnalyzer({ initialAddress, onClearAddress }: ContractAnalyzerProps) {
  const [address, setAddress] = useState(initialAddress || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState("");

  // Auto-analyze when initialAddress is provided
  useEffect(() => {
    if (initialAddress && initialAddress !== address) {
      setAddress(initialAddress);
      // Trigger analysis after a short delay
      setTimeout(() => {
        analyzeContractInternal(initialAddress);
      }, 500);
    }
  }, [initialAddress]);

  const analyzeContractInternal = async (addr: string) => {
    if (!addr) {
      setError("Please enter a contract address");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/contract/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to analyze contract");
        return;
      }

      setResult(data);
      if (onClearAddress) {
        onClearAddress();
      }
    } catch (err) {
      setError("Failed to analyze contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeContract = async () => {
    await analyzeContractInternal(address);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-red-400";
      default: return "text-zinc-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Smart Contract Analyzer</h2>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeContract()}
              placeholder="Enter contract address (0x...)"
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-white"
            />
          </div>
          <Button
            onClick={analyzeContract}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {/* Example Addresses */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <div className="text-xs text-zinc-500 mb-2">Try these Mantle contracts:</div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "USDT", addr: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE" },
                { name: "WETH", addr: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111" },
                { name: "USDC", addr: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9" },
              ].map((example) => (
                <button
                  key={example.addr}
                  onClick={() => setAddress(example.addr)}
                  className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors"
                >
                  {example.name}: {example.addr.slice(0, 6)}...{example.addr.slice(-4)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-zinc-400">Optimization Score</span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(result.analysis.gasOptimizationScore)}`}>
                  {result.analysis.gasOptimizationScore}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-zinc-400">Complexity</span>
                </div>
                <div className={`text-2xl font-bold ${getComplexityColor(result.analysis.estimatedComplexity)}`}>
                  {result.analysis.estimatedComplexity.toUpperCase()}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-zinc-400">Code Size</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(result.codeSize / 1024).toFixed(1)} KB
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-zinc-400">TX Count</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {result.transactionCount.toLocaleString()}
                </div>
              </motion.div>
            </div>

            {/* Features */}
            {result.analysis.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-lg">Detected Features</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.features.map((feature, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Risks */}
            {result.analysis.risks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-lg">Potential Risks</h3>
                </div>
                <div className="space-y-2">
                  {result.analysis.risks.map((risk, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                      className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-100 text-sm">{risk}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-lg">Mantle Optimization Tips</h3>
              </div>
              <div className="space-y-2">
                {result.analysis.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
