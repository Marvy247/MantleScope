import { useQuery } from "@tanstack/react-query";

export interface HealthMetric {
  name: string;
  status: "healthy" | "warning" | "critical";
  value: string;
  description: string;
  latency?: number;
}

interface HealthResponse {
  health: HealthMetric[];
  overallHealth: string;
  timestamp: number;
}

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error("Failed to fetch health data");
      }
      return response.json();
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
