import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatEther, parseEther } from 'viem';
import { ArrowDownUp, AlertCircle } from 'lucide-react';

interface TokenPrices {
  ethereum: {
    usd: number;
  };
}

export function TokenConverter() {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'toToken' | 'fromToken'>('toToken');

  const { data: prices, isLoading } = useQuery<TokenPrices>({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      return response.json();
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const calculateConversion = () => {
    if (!prices || !amount) return '';

    const ethPrice = prices.ethereum.usd;
    if (direction === 'toToken') {
      const tokens = parseFloat(amount) / ethPrice;
      return tokens.toFixed(6);
    } else {
      const usd = parseFloat(amount) * ethPrice;
      return usd.toFixed(2);
    }
  };

  return (
    <div className="neo-card space-y-4">
      <h2 className="text-2xl font-black mb-4">TOKEN CONVERTER</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xl font-bold mb-2">
            {direction === 'toToken' ? 'USD Amount' : 'ETH Amount'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="neo-input"
            placeholder="0.00"
          />
        </div>

        <button
          onClick={() => setDirection(d => d === 'toToken' ? 'fromToken' : 'toToken')}
          className="neo-button w-full flex items-center justify-center"
        >
          <ArrowDownUp className="mr-2" />
          Swap Direction
        </button>

        <div>
          <label className="block text-xl font-bold mb-2">
            {direction === 'toToken' ? 'ETH Amount' : 'USD Amount'}
          </label>
          <div className="neo-input bg-gray-100">
            {isLoading ? 'Loading...' : calculateConversion()}
          </div>
        </div>

        {prices && (
          <div className="text-sm font-bold">
            Current ETH Price: ${prices.ethereum.usd}
          </div>
        )}
      </div>
    </div>
  );
}