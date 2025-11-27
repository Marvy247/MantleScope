"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

export default function PerformanceChart() {
  const { data: performanceData } = usePerformance(24);
  const dataPoints = performanceData?.dataPoints.map(d => d.tps) || [];
  const stats = performanceData?.statistics;
  const maxValue = stats?.maxTps || 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Network Performance</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">Last 24 hours</span>
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+8.2%</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {dataPoints.map((value, index) => {
            const height = (value / maxValue) * 100;
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-purple-500/50 to-purple-400/30 rounded-t-md relative group hover:from-purple-500/70 hover:to-purple-400/50 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                  {value} TPS
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
        <span>24h ago</span>
        <span>Now</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800">
        {[
          { label: "Avg TPS", value: stats?.avgTps || 0 },
          { label: "Peak TPS", value: stats?.maxTps || 0 },
          { label: "Min TPS", value: stats?.minTps || 0 }
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
