import { Transaction } from '@/types/transactions';

export const sampleTransactions: Transaction[] = [
  {
    sender: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    receiver: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
    value: '1.5',
    timestamp: '1/13/2025, 11:22:51 PM',
    hash: '0x8a2f35c7890d4e1b9c6d8f3a2b1c4d5e6f7a8b9c',
  },
  {
    sender: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
    receiver: '0x9876543210abcdef0123456789abcdef01234567',
    value: '0.05',
    timestamp: '1/12/2025, 3:15:22 PM',
    hash: '0x1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
  },
  {
    sender: '0x456789abcdef0123456789abcdef0123456789ab',
    receiver: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '2.75',
    timestamp: '1/10/2025, 9:45:03 AM',
    hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
  },
  {
    sender: '0xabcdef0123456789abcdef0123456789abcdef01',
    receiver: '0x456789abcdef0123456789abcdef0123456789ab',
    value: '0.8',
    timestamp: '1/9/2025, 7:30:17 PM',
    hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
  },
];
