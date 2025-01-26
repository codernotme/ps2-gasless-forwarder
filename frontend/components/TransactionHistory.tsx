"use client";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Badge } from "@heroui/badge";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Transaction type definition
 * Represents a single transaction record
 */
type Transaction = {
  id: string;
  hash: string;
  type: "ERC20" | "ERC721";
  amount: string;
  recipient: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
};

/**
 * Mock transaction data
 * TODO: Replace with actual transaction fetching
 */
const mockTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0x1234...5678",
    type: "ERC20",
    amount: "100",
    recipient: "0xabcd...efgh",
    status: "completed",
    timestamp: "2024-03-20 14:30",
  },
  {
    id: "2",
    hash: "0x8765...4321",
    type: "ERC721",
    amount: "42",
    recipient: "0xijkl...mnop",
    status: "pending",
    timestamp: "2024-03-20 14:25",
  },
];

/**
 * Transaction History Component
 * Displays a table of past transactions with their status
 */
export default function TransactionHistory() {
  // State management for transactions and loading state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      // Simulate a network request with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  // Loading state display
  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.hash}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.recipient}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="solid"
                    color={tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "danger"}
                  >
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
