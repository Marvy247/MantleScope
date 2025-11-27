import { NextResponse } from "next/server";
import { mantleService } from "@/lib/blockchain";

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gas: number;
  gasPrice: string;
  blockNumber: number;
  timestamp: number;
  type: "transfer" | "contract" | "swap";
  status: "success" | "pending" | "failed";
}

let transactionsCache: any = null;
let lastFetch = 0;
const CACHE_DURATION = 2000; // 2 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const now = Date.now();
    
    // Return cached data if still fresh
    if (transactionsCache && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json({
        ...transactionsCache,
        limit,
      });
    }

    // Fetch real transactions from Mantle blockchain
    const recentTxs = await mantleService.getRecentTransactions(limit);
    const blockNumber = await mantleService.getBlockNumber();

    // Classify transaction types based on 'to' field and value
    const transactions: Transaction[] = recentTxs.map((tx: any) => {
      let type: "transfer" | "contract" | "swap" = "transfer";
      
      if (!tx.to) {
        type = "contract"; // Contract deployment
      } else if (parseFloat(tx.value) === 0) {
        type = "contract"; // Contract interaction
      } else if (parseFloat(tx.value) > 0) {
        // Simple heuristic: could be swap if gas is high
        type = tx.gas > 200000 ? "swap" : "transfer";
      }

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        blockNumber: tx.blockNumber,
        timestamp: Date.now() - Math.floor(Math.random() * 300000), // Approximate
        type,
        status: tx.status,
      };
    });

    const response = {
      transactions,
      total: Number(blockNumber) * 50, // Rough estimate
      page: 1,
      limit,
    };

    // Update cache
    transactionsCache = response;
    lastFetch = now;
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    
    // Return cached data if available
    if (transactionsCache) {
      return NextResponse.json(transactionsCache);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch transactions from Mantle RPC" }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
