"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search transactions, addresses, blocks..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-2xl"
    >
      <div
        className={`relative flex items-center transition-all ${
          isFocused ? "ring-2 ring-blue-500/50" : ""
        } bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden`}
      >
        <div className="absolute left-4 text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-12 pr-12 py-6 bg-transparent border-none text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearSearch}
            className="absolute right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {query && isFocused && query.startsWith("0x") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-2xl z-50"
        >
          <div className="text-sm text-zinc-400 mb-2">Detected address format:</div>
          <div className="space-y-2">
            <button
              onClick={() => {
                onSearch(query);
                setIsFocused(false);
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 transition-colors text-white text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Analyze contract: <span className="text-blue-400 font-mono">{query.slice(0, 10)}...{query.slice(-6)}</span></span>
            </button>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Press Enter or click above to analyze
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
