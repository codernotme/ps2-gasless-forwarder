import { useEffect } from 'react';
import { useWeb3Store } from '../store/web3Store';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const { address } = useWeb3Store();

  useEffect(() => {
    if (!address) return;

    const signInWithMetaMask = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'ethereum',
          options: {
            address,
          },
        });

        if (error) throw error;

        // Update user profile if needed
        if (data?.user) {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              wallet_address: address,
              last_login: new Date().toISOString(),
            });
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    signInWithMetaMask();
  }, [address]);

  return { supabase };
}