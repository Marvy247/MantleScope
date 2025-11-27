import { NextResponse } from "next/server";
import { mantleService } from "@/lib/blockchain";

// Cache for metrics to avoid overwhelming the RPC
let metricsCache: any = null;
let lastFetch = 0;
const CACHE_DURATION = 3000; // 3 seconds

export async function GET() {
  try {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (metricsCache && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(metricsCache);
    }

    // Fetch real data from Mantle blockchain
    const networkMetrics = await mantleService.getNetworkMetrics();
    const avgBlockTime = await mantleService.getAverageBlockTime(50);

    // Calculate changes (simulate for now, would need historical DB for real changes)
    const tpsChange = (Math.random() * 20 - 10).toFixed(1);
    const gasPriceChange = (Math.random() * 15 - 7).toFixed(1);
    
    const metrics = {
      tps: {
        value: parseFloat(networkMetrics.tps),
        change: tpsChange,
      },
      gasPrice: {
        value: networkMetrics.gasPrice,
        change: gasPriceChange,
      },
      activeContracts: {
        value: Math.floor(Math.random() * 5000) + 10000, // Would need indexer for real data
        change: (Math.random() * 10).toFixed(1),
      },
      daLayerSize: {
        value: (networkMetrics.blockSize / 1024).toFixed(1), // KB
        change: (Math.random() * 15).toFixed(1),
      },
      blockHeight: networkMetrics.blockNumber,
      avgBlockTime: avgBlockTime.toFixed(2),
      validatorCount: 127,
      latestBlockTimestamp: networkMetrics.latestBlockTimestamp,
      transactionCount: networkMetrics.transactionCount,
    };

    // Update cache
    metricsCache = metrics;
    lastFetch = now;

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    
    // Return cached data if available, even if stale
    if (metricsCache) {
      return NextResponse.json(metricsCache);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch metrics from Mantle RPC" }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
