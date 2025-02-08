import { type Address } from 'viem';

export const FORWARDER_ADDRESS = '0x1234567890123456789012345678901234567890' as Address;

export const FORWARDER_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        components: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'gas', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'data', type: 'bytes' },
          { name: 'deadline', type: 'uint256' }
        ],
        name: 'req',
        type: 'tuple'
      },
      { name: 'signature', type: 'bytes' }
    ],
    name: 'execute',
    outputs: [
      { name: '', type: 'bool' },
      { name: '', type: 'bytes' }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;