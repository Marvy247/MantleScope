import { NextResponse } from "next/server";
import { mantleService } from "@/lib/blockchain";
import { isAddress } from "viem";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || !isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address" },
        { status: 400 }
      );
    }

    // Analyze the contract
    const contractData = await mantleService.analyzeContract(address as `0x${string}`);

    if (!contractData.isContract) {
      return NextResponse.json(
        { error: "Address is not a contract", ...contractData },
        { status: 400 }
      );
    }

    // Analyze bytecode for patterns
    const analysis = analyzeBytecodePatterns(contractData.bytecode);
    
    // Get recent transactions
    const latestBlock = await mantleService.getLatestBlock();
    const contractTransactions = latestBlock.transactions
      ? (latestBlock.transactions as any[]).filter(
          (tx) => typeof tx !== 'string' && (tx.to?.toLowerCase() === address.toLowerCase() || tx.from?.toLowerCase() === address.toLowerCase())
        ).slice(0, 5)
      : [];

    return NextResponse.json({
      address: contractData.address,
      isContract: contractData.isContract,
      codeSize: contractData.codeSize,
      balance: contractData.balance,
      transactionCount: contractData.transactionCount,
      analysis,
      recentTransactions: contractTransactions.length,
    });
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return NextResponse.json(
      { error: "Failed to analyze contract" },
      { status: 500 }
    );
  }
}

function analyzeBytecodePatterns(bytecode: string) {
  const analysis = {
    hasProxy: false,
    hasUpgradeable: false,
    hasReentrancyGuard: false,
    hasPausable: false,
    hasOwnable: false,
    estimatedComplexity: "low" as "low" | "medium" | "high",
    gasOptimizationScore: 0,
    features: [] as string[],
    risks: [] as string[],
    recommendations: [] as string[],
  };

  // Check for common patterns
  if (bytecode.includes("363d3d373d3d3d363d73")) {
    analysis.hasProxy = true;
    analysis.features.push("Proxy Pattern");
  }

  if (bytecode.includes("7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")) {
    analysis.hasUpgradeable = true;
    analysis.features.push("Upgradeable (EIP-1967)");
  }

  // Check for reentrancy guard patterns
  if (bytecode.includes("60016002") || bytecode.includes("5f5f3e")) {
    analysis.hasReentrancyGuard = true;
    analysis.features.push("Reentrancy Protection");
  }

  // Check for pausable pattern
  if (bytecode.includes("60ff16") || bytecode.includes("paused")) {
    analysis.hasPausable = true;
    analysis.features.push("Pausable");
  }

  // Check for ownable pattern
  if (bytecode.includes("8da5cb5b") || bytecode.includes("owner")) {
    analysis.hasOwnable = true;
    analysis.features.push("Ownable/Access Control");
  }

  // Estimate complexity based on bytecode size
  const codeSize = (bytecode.length - 2) / 2;
  if (codeSize < 5000) {
    analysis.estimatedComplexity = "low";
  } else if (codeSize < 15000) {
    analysis.estimatedComplexity = "medium";
  } else {
    analysis.estimatedComplexity = "high";
  }

  // Gas optimization score (0-100)
  let score = 100;
  
  // Penalty for large contracts
  if (codeSize > 20000) {
    score -= 20;
    analysis.recommendations.push("Consider splitting into multiple contracts");
  }
  
  // Bonus for using proven patterns
  if (analysis.hasReentrancyGuard) score += 5;
  if (analysis.hasUpgradeable) score += 5;

  // Check for potential issues
  if (!analysis.hasReentrancyGuard && analysis.estimatedComplexity !== "low") {
    analysis.risks.push("No reentrancy protection detected");
    score -= 10;
  }

  if (!analysis.hasOwnable && analysis.estimatedComplexity !== "low") {
    analysis.risks.push("No access control detected");
    score -= 5;
  }

  // Mantle-specific optimizations
  analysis.recommendations.push("Use batch transactions to leverage Mantle's DA layer efficiency");
  analysis.recommendations.push("Optimize storage reads - DA layer costs are lower");
  
  if (analysis.hasProxy) {
    analysis.recommendations.push("Consider Mantle's native upgradability features");
  }

  analysis.gasOptimizationScore = Math.max(0, Math.min(100, score));

  return analysis;
}

export const dynamic = 'force-dynamic';
