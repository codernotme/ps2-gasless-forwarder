import { config } from '@/config';

export const api = {
  async getBalance(address: string) {
    const response = await fetch(`${config.API_BASE_URL}/balance?address=${address}`);
    return response.json();
  },

  async getTransactionHistory(address: string) {
    const response = await fetch(`${config.API_BASE_URL}/history?address=${address}`);
    return response.json();
  },

  async relayTransaction(transaction: any) {
    const response = await fetch(`${config.API_BASE_URL}/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return response.json();
  }
}; 