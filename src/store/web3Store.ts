import { create } from 'zustand';
import { publicClient, createWallet } from '../lib/web3Client';
import { type Address, formatEther } from 'viem';

interface Web3State {
  address: Address | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
}

export const useWeb3Store = create<Web3State>((set) => ({
  address: null,
  balance: '0',
  isConnecting: false,
  error: null,

  connect: async () => {
    try {
      set({ isConnecting: true, error: null });
      const wallet = createWallet();
      const [address] = await wallet.requestAddresses();
      
      set({ address });
      await useWeb3Store.getState().updateBalance();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    set({ address: null, balance: '0' });
  },

  updateBalance: async () => {
    const { address } = useWeb3Store.getState();
    if (!address) return;

    try {
      const balance = await publicClient.getBalance({ address });
      set({ balance: formatEther(balance) });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));