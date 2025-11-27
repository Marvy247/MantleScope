"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Bell, CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Alert {
  id: string;
  type: "info" | "warning" | "critical" | "success";
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

const alertIcons = {
  info: Bell,
  warning: AlertCircle,
  critical: XCircle,
  success: CheckCircle2,
};

const alertColors = {
  info: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  warning: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  success: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
};

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "High Memory Pool",
    message: "Transaction memory pool size exceeds 5,000 pending transactions",
    timestamp: Date.now() - 300000,
    isRead: false,
  },
  {
    id: "2",
    type: "success",
    title: "Network Upgrade Complete",
    message: "Consensus layer successfully upgraded to v2.4.1",
    timestamp: Date.now() - 600000,
    isRead: false,
  },
  {
    id: "3",
    type: "info",
    title: "TPS Increase",
    message: "Network TPS increased by 15% in the last hour",
    timestamp: Date.now() - 900000,
    isRead: true,
  },
];

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-zinc-400">{unreadCount} unread</span>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    <AnimatePresence>
                      {alerts.map((alert) => {
                        const Icon = alertIcons[alert.type];
                        const colors = alertColors[alert.type];

                        return (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            onClick={() => markAsRead(alert.id)}
                            className={`${colors.bg} border ${colors.border} rounded-lg p-3 cursor-pointer hover:border-zinc-600 transition-colors ${
                              !alert.isRead ? "ring-1 ring-blue-500/20" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`font-medium ${colors.text} text-sm`}>
                                    {alert.title}
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dismissAlert(alert.id);
                                    }}
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">{alert.message}</p>
                                <span className="text-xs text-zinc-500 mt-2 block">
                                  {formatTime(alert.timestamp)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
