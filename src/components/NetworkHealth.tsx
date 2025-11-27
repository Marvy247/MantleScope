"use client";

import { motion } from "framer-motion";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useHealth } from "@/hooks/useHealth";

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30"
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30"
  },
  critical: {
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30"
  }
};

export default function NetworkHealth() {
  const { data: healthData } = useHealth();
  const healthPercentage = parseFloat(healthData?.overallHealth || "0");
  const healthMetrics = healthData?.health || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold">Network Health</h2>
      </div>

      {/* Health Score */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-800"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - healthPercentage / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-green-400"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white"
              >
                {healthPercentage.toFixed(0)}%
              </motion.div>
              <div className="text-xs text-zinc-400">Health Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="space-y-3">
        {healthMetrics.map((metric, index) => {
          const config = statusConfig[metric.status];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${config.bg} ${config.border} border rounded-lg p-3`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className={`w-4 h-4 ${config.color} mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{metric.name}</span>
                      <span className={`text-sm font-semibold ${config.color}`}>{metric.value}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{metric.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
