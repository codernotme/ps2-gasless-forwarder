"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card } from "@heroui/card";
import { useWallet } from "@/hooks/useWallet";
import { Loader2 } from "lucide-react";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

interface TokenBalanceProps {
  tokenAddress: string;
}

export function TokenBalance({ tokenAddress }: TokenBalanceProps) {
  const { provider, address } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !address || !tokenAddress) {
        setLoading(false);
        return;
      }

      try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const [balanceWei, decimals, tokenSymbol] = await Promise.all([
          contract.balanceOf(address),
          contract.decimals(),
          contract.symbol(),
        ]);

        const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
        setBalance(balanceFormatted);
        setSymbol(tokenSymbol);
        setError(null);
      } catch (err) {
        setError("Failed to fetch token balance");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [provider, address, tokenAddress]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm text-destructive">{error}</p>
      </Card>
    );
  }

  if (!balance || !symbol) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="text-sm">
        Balance: {parseFloat(balance).toFixed(4)} {symbol}
      </div>
    </Card>
  );
}