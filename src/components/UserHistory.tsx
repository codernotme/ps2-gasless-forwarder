import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { useWeb3Store } from '../store/web3Store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Transaction {
  id: string;
  user_address: string;
  transaction_hash: string;
  type: 'ERC20' | 'ERC721' | 'BATCH';
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export function UserHistory() {
  const { address } = useWeb3Store();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      if (!address) return [];
      if (!isSupabaseConfigured()) {
        throw new Error('Database connection not configured');
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_address', address)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!address && isSupabaseConfigured()
  });

  if (!isSupabaseConfigured()) {
    return (
      <div className="neo-card">
        <h2 className="text-2xl font-black mb-4">TRANSACTION HISTORY</h2>
        <div className="p-4 bg-yellow-500 text-black font-bold flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Please connect to Supabase to view transaction history
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="neo-card">
        <h2 className="text-2xl font-black mb-4">TRANSACTION HISTORY</h2>
        <p>Connect your wallet to view history</p>
      </div>
    );
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="neo-card">
      <h2 className="text-2xl font-black mb-4">TRANSACTION HISTORY</h2>

      {error && (
        <div className="p-4 bg-red-500 text-white font-bold flex items-center mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error instanceof Error ? error.message : 'Failed to load transactions'}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : transactions?.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions?.map((tx) => (
            <div key={tx.id} className="neo-card-secondary">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{tx.type} Transfer</div>
                  <div className="text-sm">
                    {formatTimeAgo(tx.created_at)}
                  </div>
                </div>
                <div className={`neo-status neo-status-${tx.status}`}>
                  {tx.status}
                </div>
              </div>
              <a
                href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-black flex items-center mt-2"
              >
                View on Etherscan
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}