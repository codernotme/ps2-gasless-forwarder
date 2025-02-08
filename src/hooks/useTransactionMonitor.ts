import { useState, useEffect } from 'react';
import { type Hash } from 'viem';
import { relayerService } from '../services/relayer';
import { useWeb3Store } from '../store/web3Store';

export function useTransactionMonitor(hash?: Hash) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [receipt, setReceipt] = useState<any>(null);
  const { updateBalance } = useWeb3Store();

  useEffect(() => {
    if (!hash) return;

    const checkStatus = async () => {
      try {
        const txStatus = await relayerService.getTransactionStatus(hash);
        
        if (txStatus.status === 'success') {
          setStatus('success');
          setReceipt(txStatus);
          await updateBalance();
          relayerService.removePendingTransaction(hash);
        } else if (txStatus.status === 'reverted') {
          setStatus('error');
          setReceipt(txStatus);
          relayerService.removePendingTransaction(hash);
        }
      } catch (error) {
        console.error('Error monitoring transaction:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [hash, updateBalance]);

  return { status, receipt };
}