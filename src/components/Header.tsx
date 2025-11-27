"use client";

import { motion } from "framer-motion";
import { Activity, Github } from "lucide-react";
import AlertsPanel from "./AlertsPanel";
import SearchBar from "./SearchBar";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50" />
              <Activity className="w-8 h-8 text-blue-400 relative" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mantle Observatory
              </h1>
              <p className="text-xs text-zinc-400">Real-time Network Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Network Healthy</span>
            </motion.div>

            <AlertsPanel />
            
            <appkit-button />
            
            <motion.a
              href="https://github.com/yourusername/mantle-observatory"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
      </div>
    </motion.header>
  );
}
