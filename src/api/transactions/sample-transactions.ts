import { Transaction, TransactionOverview } from '@/types/transactions';

// Obscured but consistent wallet addresses
const USER_WALLET = '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0';
const EXCHANGE_WALLET_1 = '0xE1F2A3B4C5D6E7F8A9B0A1B2C3D4E5F6A7B8C9D0';
const EXCHANGE_WALLET_2 = '0xB0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9';
const DEFI_PROTOCOL_1 = '0xC9D0E1F2A3B4C5D6E7F8A9B0A1B2C3D4E5F6A7B8';
const DEFI_PROTOCOL_2 = '0xD6E7F8A9B0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5';
const NFT_MARKETPLACE = '0xF8A9B0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7';
const FRIEND_WALLET_1 = '0x1234567890ABCDEF1234567890ABCDEF12345678';
const FRIEND_WALLET_2 = '0x9876543210FEDCBA9876543210FEDCBA98765432';

export const sampleTransactions: Transaction[] = [
  {
    sender: USER_WALLET,
    receiver: FRIEND_WALLET_1,
    value: '1.5',
    timestamp: '1/13/2025, 11:22:51 PM',
    hash: '0x8a2f35c7890d4e1b9c6d8f3a2b1c4d5e6f7a8b9c',
  },
  {
    sender: FRIEND_WALLET_1,
    receiver: FRIEND_WALLET_2,
    value: '0.05',
    timestamp: '1/12/2025, 3:15:22 PM',
    hash: '0x1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
  },
  {
    sender: EXCHANGE_WALLET_1,
    receiver: USER_WALLET,
    value: '2.75',
    timestamp: '1/10/2025, 9:45:03 AM',
    hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
  },
  {
    sender: DEFI_PROTOCOL_1,
    receiver: EXCHANGE_WALLET_1,
    value: '0.8',
    timestamp: '1/9/2025, 7:30:17 PM',
    hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
  },
];

export const sampleOverview: TransactionOverview = {
  money_in: [
    {
      sender: EXCHANGE_WALLET_1,
      receiver: USER_WALLET,
      value: '12000.0',
      timestamp: '2/15/2025, 10:56:05 AM',
      hash: '0x10ea225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26b9',
    },
    {
      sender: FRIEND_WALLET_2,
      receiver: USER_WALLET,
      value: '3.5',
      timestamp: '2/17/2025, 2:14:22 PM',
      hash: '0x45ea225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26c8',
    },
    {
      sender: DEFI_PROTOCOL_2,
      receiver: USER_WALLET,
      value: '125.75',
      timestamp: '2/18/2025, 10:32:47 AM',
      hash: '0x67fa225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26d7',
    },
    {
      sender: NFT_MARKETPLACE,
      receiver: USER_WALLET,
      value: '450.0',
      timestamp: '2/20/2025, 8:05:19 PM',
      hash: '0x89cb225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26e6',
    },
  ],
  money_out: [
    {
      sender: USER_WALLET,
      receiver: DEFI_PROTOCOL_1,
      value: '11999.0',
      timestamp: '2/21/2025, 8:19:39 PM',
      hash: '0x676db7f4b163080774430d1a8b8223b7e5f4491c1e732e5c1616037ece880b06',
    },
    {
      sender: USER_WALLET,
      receiver: DEFI_PROTOCOL_1,
      value: '1.0',
      timestamp: '2/21/2025, 8:17:51 PM',
      hash: '0xe38b7974267362037c103d6720440a55547ac4651d2229243484be98a343ac4f',
    },
    {
      sender: USER_WALLET,
      receiver: FRIEND_WALLET_1,
      value: '25.5',
      timestamp: '2/19/2025, 3:45:12 PM',
      hash: '0xf49c7974267362037c103d6720440a55547ac4651d2229243484be98a343ac5e',
    },
    {
      sender: USER_WALLET,
      receiver: NFT_MARKETPLACE,
      value: '210.0',
      timestamp: '2/17/2025, 11:22:33 AM',
      hash: '0xa5ad7974267362037c103d6720440a55547ac4651d2229243484be98a343ac6d',
    },
    {
      sender: USER_WALLET,
      receiver: EXCHANGE_WALLET_2,
      value: '343.75',
      timestamp: '2/16/2025, 9:10:05 AM',
      hash: '0xb6be7974267362037c103d6720440a55547ac4651d2229243484be98a343ac7c',
    },
  ],
  transactions: [
    {
      sender: USER_WALLET,
      receiver: DEFI_PROTOCOL_1,
      value: '11999.0',
      timestamp: '2/21/2025, 8:19:39 PM',
      hash: '0x676db7f4b163080774430d1a8b8223b7e5f4491c1e732e5c1616037ece880b06',
    },
    {
      sender: USER_WALLET,
      receiver: DEFI_PROTOCOL_1,
      value: '1.0',
      timestamp: '2/21/2025, 8:17:51 PM',
      hash: '0xe38b7974267362037c103d6720440a55547ac4651d2229243484be98a343ac4f',
    },
    {
      sender: NFT_MARKETPLACE,
      receiver: USER_WALLET,
      value: '450.0',
      timestamp: '2/20/2025, 8:05:19 PM',
      hash: '0x89cb225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26e6',
    },
    {
      sender: USER_WALLET,
      receiver: FRIEND_WALLET_1,
      value: '25.5',
      timestamp: '2/19/2025, 3:45:12 PM',
      hash: '0xf49c7974267362037c103d6720440a55547ac4651d2229243484be98a343ac5e',
    },
    {
      sender: DEFI_PROTOCOL_2,
      receiver: USER_WALLET,
      value: '125.75',
      timestamp: '2/18/2025, 10:32:47 AM',
      hash: '0x67fa225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26d7',
    },
    {
      sender: FRIEND_WALLET_2,
      receiver: USER_WALLET,
      value: '3.5',
      timestamp: '2/17/2025, 2:14:22 PM',
      hash: '0x45ea225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26c8',
    },
    {
      sender: USER_WALLET,
      receiver: NFT_MARKETPLACE,
      value: '210.0',
      timestamp: '2/17/2025, 11:22:33 AM',
      hash: '0xa5ad7974267362037c103d6720440a55547ac4651d2229243484be98a343ac6d',
    },
    {
      sender: USER_WALLET,
      receiver: EXCHANGE_WALLET_2,
      value: '343.75',
      timestamp: '2/16/2025, 9:10:05 AM',
      hash: '0xb6be7974267362037c103d6720440a55547ac4651d2229243484be98a343ac7c',
    },
    {
      sender: EXCHANGE_WALLET_1,
      receiver: USER_WALLET,
      value: '12000.0',
      timestamp: '2/15/2025, 10:56:05 AM',
      hash: '0x10ea225d5988b2dc2704032c1eb6525a3c1e940fac1a7a614d1d8101d2ef26b9',
    },
  ],
  total_money_in: '12579.25',
  total_money_out: '12579.25',
};
