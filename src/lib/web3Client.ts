import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export const createWallet = () => {
  if (!window.ethereum) throw new Error('No MetaMask found');
  
  return createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum)
  });
};