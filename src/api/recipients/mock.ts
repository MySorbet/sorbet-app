import { v4 as uuidv4 } from 'uuid';

import { RecipientAPI } from './types';

const mockWalletAddress = '0x1234567890123456789012345678901234567890';

/**
 * Mock recipients for testing
 * Note: Keep recipient 0 as a USD recipient and recipient 1 as a EUR recipient and recipient 2 as a crypto recipient
 */
export const mockRecipients: RecipientAPI[] = [
  {
    id: uuidv4(),
    type: 'usd',
    walletAddress: mockWalletAddress,
    liquidationAddressId: uuidv4(),
    externalAccountId: uuidv4(),
    label: 'USD Bank',
    detail: '7890',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  },
  {
    id: uuidv4(),
    type: 'eur',
    walletAddress: mockWalletAddress,
    liquidationAddressId: uuidv4(),
    externalAccountId: uuidv4(),
    label: 'EUR Bank',
    detail: '7890',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  },
  {
    id: uuidv4(),
    type: 'crypto',
    walletAddress: mockWalletAddress,
    label: 'Crypto Recipient',
    detail: mockWalletAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  },
  {
    id: uuidv4(),
    type: 'usd',
    walletAddress: mockWalletAddress,
    liquidationAddressId: uuidv4(),
    externalAccountId: uuidv4(),
    label: 'USD Bank 2',
    detail: '7890',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  },
  {
    id: uuidv4(),
    type: 'crypto',
    walletAddress: mockWalletAddress,
    label: 'Crypto Recipient 2',
    detail: mockWalletAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
  },
];
