"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Custom hook for managing wallet connection and state
 * Handles wallet connection, network changes, and account changes
 */
export function useWallet() {
  // State management for wallet connection
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider and set up event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAddress(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId));
      });
    }
  }, []);

  /**
   * Connect to the wallet
   * Requests account access and retrieves network information
   */
  const connect = async () => {
    if (!provider) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect from the wallet
   * Resets all wallet-related state
   */
  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  return {
    address,
    chainId,
    provider,
    isConnecting,
    error,
    connect,
    disconnect
  };
}