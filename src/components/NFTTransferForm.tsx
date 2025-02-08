import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGaslessTransfer } from '../hooks/useGaslessTransfer';
import { AlertCircle } from 'lucide-react';

const schema = z.object({
  tokenAddress: z.string().startsWith('0x').length(42),
  recipient: z.string().startsWith('0x').length(42),
  tokenId: z.string().regex(/^\d+$/)
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: (hash: `0x${string}`) => void;
}

export function NFTTransferForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const { transfer, isLoading, error } = useGaslessTransfer();

  const onSubmit = async (data: FormData) => {
    try {
      const hash = await transfer('erc721', {
        token: data.tokenAddress,
        to: data.recipient,
        tokenId: data.tokenId
      });
      onSuccess(hash);
      reset();
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xl font-bold mb-2">NFT Contract Address</label>
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

      <div>
        <label className="block text-xl font-bold mb-2">Token ID</label>
        <input
          {...register('tokenId')}
          className="neo-input"
          placeholder="1"
          type="text"
        />
        {errors.tokenId && (
          <p className="mt-1 text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.tokenId.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500 text-white font-bold flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="neo-button w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Transfer NFT'}
      </button>
    </form>
  );
}