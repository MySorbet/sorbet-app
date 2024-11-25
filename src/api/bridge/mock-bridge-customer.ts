import { BridgeCustomer } from '@/types';

export const mockBridgeCustomer: BridgeCustomer = {
  virtual_account: {
    id: 'mock-virtual-account-id',
    status: 'active',
    developer_fee_percent: '1.5',
    customer_id: 'mock-customer-id',
    source_deposit_instructions: {
      currency: 'USD',
      bank_name: 'Silicon Valley Bank',
      bank_address: '3003 Tasman Drive, Santa Clara, CA 95054',
      bank_routing_number: '121140399',
      bank_account_number: '1234567890',
      bank_beneficiary_name: 'Sorbet Technologies Inc.',
      bank_beneficiary_address: '123 Market Street, San Francisco, CA 94105',
      payment_rail: 'ach',
      payment_rails: ['ach', 'wire'],
    },
    destination: {
      currency: 'USD',
      payment_rail: 'ach',
      address: '123 Market Street, San Francisco, CA 94105',
    },
  },
  customer_id: '220d5e70-48f9-4971-b547-c19b93d2ba1c',
  kyc_link: 'https://mysorbet.xyz',
  tos_link: 'https://mysorbet.xyz',
  kyc_status: 'not_started',
  tos_status: 'pending',
};
