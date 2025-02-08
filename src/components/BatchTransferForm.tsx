import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGaslessTransfer } from '../hooks/useGaslessTransfer';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

const transferSchema = z.object({
  tokenAddress: z.string().startsWith('0x').length(42),
  recipient: z.string().startsWith('0x').length(42),
  amount: z.string().regex(/^\d*\.?\d*$/),
  isERC721: z.boolean(),
  tokenId: z.string().regex(/^\d*$/).optional()
});

type TransferData = z.infer<typeof transferSchema>;

interface Props {
  onSuccess: (hash: `0x${string}`) => void;
}

export function BatchTransferForm({ onSuccess }: Props) {
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const { transfer, isLoading, error } = useGaslessTransfer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TransferData>({
    resolver: zodResolver(transferSchema)
  });

  const isERC721 = watch('isERC721');

  const onSubmit = async (data: TransferData) => {
    setTransfers([...transfers, data]);
    reset();
  };

  const removeTransfer = (index: number) => {
    setTransfers(transfers.filter((_, i) => i !== index));
  };

  const executeBatch = async () => {
    try {
      const hash = await transfer('batch', { transfers });
      onSuccess(hash);
      setTransfers([]);
    } catch (err) {
      console.error('Batch transfer failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('isERC721')}
              className="neo-checkbox"
            />
            <span className="font-bold">NFT Transfer</span>
          </label>
        </div>

        <div>
          <label className="block text-xl font-bold mb-2">
            {isERC721 ? 'NFT Contract Address' : 'Token Address'}
          </label>
          <input
            {...register('tokenAddress')}
            className="neo-input"
            placeholder="0x..."
          />
          {errors.tokenAddress && (
            <p className="mt-1 text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.tokenAddress.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xl font-bold mb-2">Recipient</label>
          <input
            {...register('recipient')}
            className="neo-input"
            placeholder="0x..."
          />
          {errors.recipient && (
            <p className="mt-1 text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.recipient.message}
            </p>
          )}
        </div>

        {isERC721 ? (
          <div>
            <label className="block text-xl font-bold mb-2">Token ID</label>
            <input
              {...register('tokenId')}
              className="neo-input"
              placeholder="1"
            />
            {errors.tokenId && (
              <p className="mt-1 text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.tokenId.message}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xl font-bold mb-2">Amount</label>
            <input
              {...register('amount')}
              className="neo-input"
              placeholder="0.0"
            />
            {errors.amount && (
              <p className="mt-1 text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.amount.message}
              </p>
            )}
          </div>
        )}

        <button type="submit" className="neo-button w-full">
          <Plus className="inline-block mr-2" />
          Add to Batch
        </button>
      </form>

      {transfers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Batch Queue</h3>
          <div className="space-y-2">
            {transfers.map((t, i) => (
              <div key={i} className="neo-card-secondary flex justify-between items-center">
                <div>
                  <p className="font-bold">{t.isERC721 ? 'NFT' : 'Token'}: {t.tokenAddress.slice(0, 6)}...{t.tokenAddress.slice(-4)}</p>
                  <p>To: {t.recipient.slice(0, 6)}...{t.recipient.slice(-4)}</p>
                  <p>{t.isERC721 ? `ID: ${t.tokenId}` : `Amount: ${t.amount}`}</p>
                </div>
                <button
                  onClick={() => removeTransfer(i)}
                  className="neo-button-danger"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={executeBatch}
            disabled={isLoading}
            className="neo-button w-full"
          >
            {isLoading ? 'Processing...' : 'Execute Batch Transfer'}
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500 text-white font-bold flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}