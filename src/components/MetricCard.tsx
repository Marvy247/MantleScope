"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  unit?: string;
  icon: ReactNode;
  trend: "up" | "down";
  color: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
  blue: {
    bg: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    glow: "bg-blue-500"
  },
  green: {
    bg: "from-green-500/20 to-green-600/20",
    border: "border-green-500/30",
    icon: "text-green-400",
    glow: "bg-green-500"
  },
  purple: {
    bg: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/30",
    icon: "text-purple-400",
    glow: "bg-purple-500"
  },
  orange: {
    bg: "from-orange-500/20 to-orange-600/20",
    border: "border-orange-500/30",
    icon: "text-orange-400",
    glow: "bg-orange-500"
  }
};

export default function MetricCard({
  title,
  value,
  change,
  unit,
  icon,
  trend,
  color
}: MetricCardProps) {
  const colors = colorMap[color];
  const isPositive = trend === "up" && !change.startsWith("-") || trend === "down" && change.startsWith("-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} backdrop-blur border ${colors.border} rounded-xl p-6 group`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.glow} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 bg-zinc-800/50 rounded-lg ${colors.icon}`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-medium">{change}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-zinc-400 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.h3
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white"
            >
              {value}
            </motion.h3>
            {unit && <span className="text-sm text-zinc-500 font-medium">{unit}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
