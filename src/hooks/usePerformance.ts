import { useQuery } from "@tanstack/react-query";

export interface PerformanceData {
  timestamp: number;
  tps: number;
  gasPrice: number;
  blockTime: number;
  memPoolSize: number;
}

interface PerformanceResponse {
  dataPoints: PerformanceData[];
  statistics: {
    avgTps: number;
    maxTps: number;
    minTps: number;
    avgGasPrice: string;
    period: string;
  };
}

export function usePerformance(hours: number = 24) {
  return useQuery<PerformanceResponse>({
    queryKey: ["performance", hours],
    queryFn: async () => {
      const response = await fetch(`/api/performance?hours=${hours}`);
      if (!response.ok) {
        throw new Error("Failed to fetch performance data");
      }
      return response.json();
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
