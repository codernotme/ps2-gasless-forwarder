import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface PriceData {
  prices: [number, number][];
}

export function PriceChart() {
  const { data, isLoading, error } = useQuery<PriceData>({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily'
      );
      return response.json();
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const chartData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price.toFixed(2)
  }));

  return (
    <div className="neo-card">
      <h2 className="text-2xl font-black mb-4">ETH PRICE CHART</h2>
      
      {isLoading && (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500 text-white font-bold flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Failed to load price data
        </div>
      )}

      {chartData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-64 p-4"
        >
          <div className="space-y-4">
            {chartData.map((point, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{point.date}</span>
                <span className="font-bold">${point.price}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}