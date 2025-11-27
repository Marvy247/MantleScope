import { NextResponse } from "next/server";
import { mantleService } from "@/lib/blockchain";

interface PerformanceData {
  timestamp: number;
  tps: number;
  gasPrice: number;
  blockTime: number;
  transactionCount: number;
}

let performanceCache: any = null;
let lastFetch = 0;
const CACHE_DURATION = 10000; // 10 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get("hours") || "24");
    
    const now = Date.now();
    
    // Return cached data if still fresh
    if (performanceCache && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json(performanceCache);
    }

    // Fetch historical block data from Mantle
    const historicalBlocks = await mantleService.getHistoricalBlocks(24);
    
    const dataPoints: PerformanceData[] = [];
    
    for (let i = 0; i < historicalBlocks.length; i++) {
      const block = historicalBlocks[i];
      const prevBlock = i > 0 ? historicalBlocks[i - 1] : null;
      
      // Calculate TPS for this block
      const txCount = block.transactions?.length || 0;
      const blockTime = prevBlock 
        ? Number(block.timestamp - prevBlock.timestamp)
        : 2; // Default 2 seconds
      const tps = blockTime > 0 ? txCount / blockTime : 0;
      
      dataPoints.push({
        timestamp: Number(block.timestamp) * 1000,
        tps: Math.round(tps * 10) / 10, // Round to 1 decimal
        gasPrice: block.baseFeePerGas 
          ? parseFloat((Number(block.baseFeePerGas) / 1e9).toFixed(6))
          : 0.02,
        blockTime,
        transactionCount: txCount,
      });
    }

    // Calculate statistics
    const tpsValues = dataPoints.map((d) => d.tps);
    const avgTps = Math.floor(tpsValues.reduce((a, b) => a + b, 0) / tpsValues.length);
    const maxTps = Math.max(...tpsValues);
    const minTps = Math.min(...tpsValues);

    const gasPrices = dataPoints.map((d) => d.gasPrice);
    const avgGasPrice = (gasPrices.reduce((a, b) => a + b, 0) / gasPrices.length).toFixed(6);

    const response = {
      dataPoints,
      statistics: {
        avgTps,
        maxTps,
        minTps,
        avgGasPrice,
        period: `${hours}h`,
      },
    };

    // Update cache
    performanceCache = response;
    lastFetch = now;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    
    // Return cached data if available
    if (performanceCache) {
      return NextResponse.json(performanceCache);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch performance data from Mantle RPC" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
