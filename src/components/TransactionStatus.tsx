import React from 'react';
import { type Hash } from 'viem';
import { useTransactionMonitor } from '../hooks/useTransactionMonitor';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  hash: Hash;
}

export function TransactionStatus({ hash }: Props) {
  const { status, receipt } = useTransactionMonitor(hash);

  return (
    <div className="neo-status">
      {status === 'pending' && (
        <>
          <Loader className="animate-spin mr-2" />
          <span>Processing...</span>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle className="text-green-500 mr-2" />
          <span>Success!</span>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="text-red-500 mr-2" />
          <span>Failed</span>
        </>
      )}
      {receipt && (
        <div className="mt-2 text-xs">
          <p>Block: {receipt.blockNumber}</p>
          <p>Gas Used: {receipt.gasUsed.toString()}</p>
        </div>
      )}
    </div>
  );
}