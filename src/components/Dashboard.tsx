"use client";

import { motion } from "framer-motion";
import { Activity, Layers, Zap, Database, TrendingUp, BarChart3, Code2 } from "lucide-react";
import { useState } from "react";
import MetricCard from "./MetricCard";
import TransactionFeed from "./TransactionFeed";
import NetworkHealth from "./NetworkHealth";
import PerformanceChart from "./PerformanceChart";
import ContractAnalyzer from "./ContractAnalyzer";
import Header from "./Header";
import { useMetrics } from "@/hooks/useMetrics";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type Tab = "dashboard" | "analyzer";

export default function Dashboard() {
  const { data: metrics } = useMetrics();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query && query.startsWith("0x")) {
      // If it looks like an address, switch to analyzer tab and set the query
      setActiveTab("analyzer");
      setSearchQuery(query);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Header onSearch={handleSearch} />

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 sticky top-[73px] z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
              { id: "analyzer" as Tab, label: "Contract Analyzer", icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-400"
                      : "text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-6 py-8">{activeTab === "dashboard" ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Network Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Network TPS"
              value={metrics?.tps.value.toLocaleString() || "0"}
              change={`${metrics?.tps.change}%` || "0%"}
              icon={<Zap className="w-5 h-5" />}
              trend={parseFloat(metrics?.tps.change || "0") >= 0 ? "up" : "down"}
              color="blue"
            />
            <MetricCard
              title="Gas Price"
              value={metrics?.gasPrice.value || "0"}
              change={`${metrics?.gasPrice.change}%` || "0%"}
              unit="GWEI"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={parseFloat(metrics?.gasPrice.change || "0") >= 0 ? "up" : "down"}
              color="green"
            />
            <MetricCard
              title="Active Contracts"
              value={metrics?.activeContracts.value.toLocaleString() || "0"}
              change={`${metrics?.activeContracts.change}%` || "0%"}
              icon={<Activity className="w-5 h-5" />}
              trend={parseFloat(metrics?.activeContracts.change || "0") >= 0 ? "up" : "down"}
              color="purple"
            />
            <MetricCard
              title="DA Layer Size"
              value={metrics?.daLayerSize.value || "0"}
              change={`${metrics?.daLayerSize.change}%` || "0%"}
              unit="MB"
              icon={<Database className="w-5 h-5" />}
              trend={parseFloat(metrics?.daLayerSize.change || "0") >= 0 ? "up" : "down"}
              color="orange"
            />
          </div>

          {/* Network Health & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            <div>
              <NetworkHealth />
            </div>
          </div>

          {/* Modular Layer Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Modular Architecture Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Execution Layer", status: "healthy", latency: "12ms" },
                { name: "Consensus Layer", status: "healthy", latency: "8ms" },
                { name: "Data Availability", status: "healthy", latency: "15ms" }
              ].map((layer, idx) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-300">{layer.name}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{layer.latency}</div>
                  <div className="text-xs text-zinc-400">Average Latency</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <TransactionFeed />
        </motion.div>
      ) : (
        <ContractAnalyzer initialAddress={searchQuery} onClearAddress={() => setSearchQuery("")} />
      )}
      </main>
    </div>
  );
}
