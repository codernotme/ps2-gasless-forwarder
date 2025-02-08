import { useState } from 'react';
import { parseEther, type Address, type Hash } from 'viem';
import { publicClient, createWallet } from '../lib/web3Client';
import { useWeb3Store } from '../store/web3Store';
import { relayerService } from '../services/relayer';
import { FORWARDER_ADDRESS } from '../constants/contracts';

export function useGaslessTransfer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<Hash | null>(null);
  const { address } = useWeb3Store();

  const transfer = async (to: Address, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const value = parseEther(amount);
      const wallet = createWallet();
      
      // Get current nonce
      const nonce = await publicClient.readContract({
        address: FORWARDER_ADDRESS,
        abi: [{
          inputs: [{ name: '', type: 'address' }],
          name: 'nonces',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function'
        }],
        functionName: 'nonces',
        args: [address]
      });

      // Create forward request
      const request = {
        from: address,
        to,
        value,
        gas: 21000n,
        nonce,
        data: '0x',
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now
      };

      // Sign the request
      const signature = await wallet.signMessage({
        message: {
          raw: request as any // Type assertion needed due to complex structure
        }
      });

      // Send to relayer
      const hash = await relayerService.relay(request, signature);
      setTransactionHash(hash);
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { transfer, isLoading, error, transactionHash };
}