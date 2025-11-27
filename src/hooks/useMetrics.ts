import { useQuery } from "@tanstack/react-query";

export interface Metrics {
  tps: { value: number; change: string };
  gasPrice: { value: string; change: string };
  activeContracts: { value: number; change: string };
  daLayerSize: { value: string; change: string };
  blockHeight: number;
  avgBlockTime: string;
  validatorCount: number;
  networkHash: string;
}

export function useMetrics() {
  return useQuery<Metrics>({
    queryKey: ["metrics"],
    queryFn: async () => {
      const response = await fetch("/api/metrics");
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      return response.json();
    },
    refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
  });
}
