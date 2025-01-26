"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { Select, SelectItem } from "@heroui/select";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const NETWORKS = {
  1: { name: "Ethereum", chainId: "0x1" },
  137: { name: "Polygon", chainId: "0x89" },
  42161: { name: "Arbitrum", chainId: "0xa4b1" },
  10: { name: "Optimism", chainId: "0xa" },
};

export function NetworkSelector() {
  const { chainId, provider } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const switchNetwork = async (networkId: string) => {
    if (!provider || !window.ethereum) return;
    setIsLoading(true);

    const id = parseInt(networkId);
    const network = NETWORKS[id as keyof typeof NETWORKS];

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
      toast({
        title: "Network Changed",
        description: `Switched to ${network.name}`,
      });
    } catch (error: any) {
      if (error.code === 4902) {
        toast({
          title: "Network Not Found",
          description: "Please add this network to your wallet first.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to switch network",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      label="Network"
      placeholder="Select Network"
      selectedKeys={chainId ? [chainId.toString()] : []}
      onChange={(e) => switchNetwork(e.target.value)}
      className="w-[180px]"
      isDisabled={isLoading}
    >
      {Object.entries(NETWORKS).map(([id, { name }]) => (
        <SelectItem key={id} value={id}>
          {name}
        </SelectItem>
      ))}
    </Select>
  );
}