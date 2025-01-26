"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface TransactionContextType {
  pendingTransactions: string[];
  addPendingTransaction: (hash: string) => void;
  removePendingTransaction: (hash: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [pendingTransactions, setPendingTransactions] = useState<string[]>([]);

  const addPendingTransaction = (hash: string) => {
    setPendingTransactions(prev => [...prev, hash]);
  };

  const removePendingTransaction = (hash: string) => {
    setPendingTransactions(prev => prev.filter(h => h !== hash));
  };

  return (
    <TransactionContext.Provider value={{
      pendingTransactions,
      addPendingTransaction,
      removePendingTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactionContext must be used within TransactionProvider');
  return context;
}