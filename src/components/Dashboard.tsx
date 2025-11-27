"use client";

import { motion } from "framer-motion";
import { Activity, Layers, Zap, Database, TrendingUp, AlertCircle } from "lucide-react";
import MetricCard from "./MetricCard";
import TransactionFeed from "./TransactionFeed";
import NetworkHealth from "./NetworkHealth";
import PerformanceChart from "./PerformanceChart";
import Header from "./Header";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
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
              value="2,847"
              change="+12.5%"
              icon={<Zap className="w-5 h-5" />}
              trend="up"
              color="blue"
            />
            <MetricCard
              title="Gas Price"
              value="0.023"
              change="-5.2%"
              unit="GWEI"
              icon={<TrendingUp className="w-5 h-5" />}
              trend="down"
              color="green"
            />
            <MetricCard
              title="Active Contracts"
              value="15,234"
              change="+3.8%"
              icon={<Activity className="w-5 h-5" />}
              trend="up"
              color="purple"
            />
            <MetricCard
              title="DA Layer Size"
              value="847.2"
              change="+8.1%"
              unit="MB"
              icon={<Database className="w-5 h-5" />}
              trend="up"
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
      </main>
    </div>
  );
}
