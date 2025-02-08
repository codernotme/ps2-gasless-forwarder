import { useState } from 'react';
import { parseEther, type Address, type Hash } from 'viem';
import { publicClient, createWallet } from '../lib/web3Client';
import { useWeb3Store } from '../store/web3Store';
import { FORWARDER_ADDRESS, FORWARDER_ABI } from '../constants/contracts';

type TransferType = 'erc20' | 'erc721' | 'batch';

interface ERC20Transfer {
  token: string;
  to: string;
  amount: string;
}

interface ERC721Transfer {
  token: string;
  to: string;
  tokenId: string;
}

interface BatchTransfer {
  transfers: Array<ERC20Transfer | ERC721Transfer>;
}

export function useGaslessTransfer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWeb3Store();

  const transfer = async (
    type: TransferType,
    params: ERC20Transfer | ERC721Transfer | BatchTransfer
  ): Promise<Hash> => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    setError(null);

    try {
      const wallet = createWallet();
      const nonce = await publicClient.readContract({
        address: FORWARDER_ADDRESS,
        abi: FORWARDER_ABI,
        functionName: 'nonces',
        args: [address]
      });

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour

      let request;
      let signature;

      switch (type) {
        case 'erc20': {
          const { token, to, amount } = params as ERC20Transfer;
          request = {
            from: address,
            token,
            to,
            amount: parseEther(amount),
            nonce,
            deadline
          };
          signature = await wallet.signMessage({
            message: {
              raw: request as any
            }
          });
          return await publicClient.writeContract({
            address: FORWARDER_ADDRESS,
            abi: FORWARDER_ABI,
            functionName: 'executeERC20Transfer',
            args: [request, signature]
          });
        }

        case 'erc721': {
          const { token, to, tokenId } = params as ERC721Transfer;
          request = {
            from: address,
            token,
            to,
            tokenId: BigInt(tokenId),
            nonce,
            deadline
          };
          signature = await wallet.signMessage({
            message: {
              raw: request as any
            }
          });
          return await publicClient.writeContract({
            address: FORWARDER_ADDRESS,
            abi: FORWARDER_ABI,
            functionName: 'executeERC721Transfer',
            args: [request, signature]
          });
        }

        case 'batch': {
          const { transfers } = params as BatchTransfer;
          const batchRequest = {
            tokens: transfers.map(t => 'token' in t ? t.token : t.token),
            recipients: transfers.map(t => t.to),
            amounts: transfers.map(t => 'amount' in t ? parseEther(t.amount) : 0n),
            isERC721: transfers.map(t => 'tokenId' in t),
            tokenIds: transfers.map(t => 'tokenId' in t ? BigInt(t.tokenId) : 0n)
          };
          signature = await wallet.signMessage({
            message: {
              raw: {
                ...batchRequest,
                deadline,
                nonce
              } as any
            }
          });
          return await publicClient.writeContract({
            address: FORWARDER_ADDRESS,
            abi: FORWARDER_ABI,
            functionName: 'executeBatchTransfer',
            args: [batchRequest, deadline, signature]
          });
        }

        default:
          throw new Error('Invalid transfer type');
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { transfer, isLoading, error };
}