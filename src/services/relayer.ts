import { type Address, type Hash, encodeFunctionData, parseEther } from 'viem';
import { publicClient } from '../lib/web3Client';
import { FORWARDER_ADDRESS, FORWARDER_ABI } from '../constants/contracts';

export interface RelayRequest {
  from: Address;
  to: Address;
  value: bigint;
  gas: bigint;
  nonce: bigint;
  data: string;
  deadline: bigint;
}

class RelayerService {
  private static instance: RelayerService;
  private pendingTransactions: Map<Hash, RelayRequest>;

  private constructor() {
    this.pendingTransactions = new Map();
  }

  static getInstance(): RelayerService {
    if (!RelayerService.instance) {
      RelayerService.instance = new RelayerService();
    }
    return RelayerService.instance;
  }

  async relay(request: RelayRequest, signature: string): Promise<Hash> {
    // Encode the function call
    const data = encodeFunctionData({
      abi: FORWARDER_ABI,
      functionName: 'execute',
      args: [request, signature]
    });

    // Estimate gas for the transaction
    const gasEstimate = await publicClient.estimateGas({
      account: FORWARDER_ADDRESS,
      to: request.to,
      value: request.value,
      data
    });

    // Add 20% buffer to gas estimate
    const gasLimit = (gasEstimate * 120n) / 100n;

    // Send transaction through the relayer
    const hash = await publicClient.sendTransaction({
      to: FORWARDER_ADDRESS,
      data,
      gas: gasLimit
    });

    // Store the request for monitoring
    this.pendingTransactions.set(hash, request);

    return hash;
  }

  async getTransactionStatus(hash: Hash) {
    const receipt = await publicClient.getTransactionReceipt({ hash });
    return {
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed
    };
  }

  getPendingTransaction(hash: Hash) {
    return this.pendingTransactions.get(hash);
  }

  removePendingTransaction(hash: Hash) {
    this.pendingTransactions.delete(hash);
  }
}

export const relayerService = RelayerService.getInstance();