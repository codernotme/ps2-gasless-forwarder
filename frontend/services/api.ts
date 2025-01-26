import { config } from '@/config';

interface RelayRequest {
  from: string;
  to: string;
  value: string;
  data: string;
  nonce: number;
  signature: string;
}

interface TransactionResponse {
  txHash: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  async relayTransaction(request: RelayRequest): Promise<TransactionResponse> {
    const response = await fetch(`${this.baseUrl}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to relay transaction');
    }

    return response.json();
  }

  async getTransactionHistory(address: string) {
    const response = await fetch(`${this.baseUrl}/history?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction history');
    }
    return response.json();
  }

  async getBalance(address: string) {
    const response = await fetch(`${this.baseUrl}/balance?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    return response.json();
  }
}

export const api = new ApiService(); 