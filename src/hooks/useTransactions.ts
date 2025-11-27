import { useQuery } from "@tanstack/react-query";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  blockNumber: number;
  timestamp: number;
  type: "transfer" | "contract" | "swap";
  status: "success" | "pending" | "failed";
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export function useTransactions(limit: number = 10) {
  return useQuery<TransactionsResponse>({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    },
    refetchInterval: 2000, // Refetch every 2 seconds
  });
}
