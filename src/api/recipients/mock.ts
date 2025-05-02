import { v4 as uuidv4 } from 'uuid';

import { RecipientAPI } from './types';

const mockWalletAddress = '0x1234567890123456789012345678901234567890';

/**
 * Mock recipients for testing
 * Note: Keep recipient 0 as a bank recipient and recipient 1 as a crypto recipient
 */
export const mockRecipients: RecipientAPI[] = [
  {
    id: uuidv4(),
    type: 'usd',
    walletAddress: uuidv4(),
    liquidation_address_id: uuidv4(),
    external_account_id: uuidv4(),
    label: 'USD Bank',
    detail: '1234567890',
  },
  {
    id: uuidv4(),
    type: 'crypto',
    walletAddress: mockWalletAddress,
    label: 'Crypto Recipient',
    detail: mockWalletAddress,
  },
  {
    id: uuidv4(),
    type: 'usd',
    walletAddress: uuidv4(),
    liquidation_address_id: uuidv4(),
    external_account_id: uuidv4(),
    label: 'USD Bank 2',
    detail: '1234567890',
  },
  {
    id: uuidv4(),
    type: 'crypto',
    walletAddress: mockWalletAddress,
    label: 'Crypto Recipient 2',
    detail: mockWalletAddress,
  },
];
