import { useState } from 'react';
import { useWallet } from './useWallet';
import { api } from '@/services/api';
import { ethers } from 'ethers';
import { config } from '@/config';

export function useTransaction() {
  const { provider, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const sendTransaction = async (
    to: string,
    amount: string,
    tokenAddress?: string
  ) => {
    if (!provider || !address) throw new Error('Wallet not connected');
    setIsLoading(true);

    try {
      // Get a signer from the provider
      const signer = await provider.getSigner();
      const nonce = await provider.getTransactionCount(address);
      const feeData = await provider.getFeeData();

      const transaction = {
        from: address,
        to: tokenAddress || to,
        value: tokenAddress ? '0' : ethers.parseEther(amount),
        nonce,
        gasPrice: feeData.gasPrice,
        data: tokenAddress ? generateERC20TransferData(to, amount) : '0x'
      };

      if (config.ENABLE_GASLESS) {
        // Use gasless transaction
        const messageHash = ethers.solidityPackedKeccak256(
          ['address', 'address', 'uint256', 'uint256', 'bytes'],
          [transaction.from, transaction.to, transaction.value, transaction.nonce, transaction.data]
        );
        
        const signature = await signer.signMessage(ethers.getBytes(messageHash));

        return await api.relayTransaction({
          ...transaction,
          signature
        });
      } else {
        // Regular transaction
        const tx = await signer.sendTransaction(transaction);
        return await tx.wait();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTransaction,
    isLoading
  };
}

function generateERC20TransferData(to: string, amount: string): string {
  const iface = new ethers.Interface([
    'function transfer(address to, uint256 amount)'
  ]);
  return iface.encodeFunctionData('transfer', [to, ethers.parseEther(amount)]);
} 