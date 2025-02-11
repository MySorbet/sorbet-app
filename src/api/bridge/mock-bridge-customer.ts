import { BridgeCustomer } from '@/types';

/** Dev url for Persona */
const PERSONA_URL =
  'https://bridge.withpersona.com/verify?inquiry-template-id=itmpl_NtHYpb9AbEYCPxGo5iRbc9d2&fields%5Bdeveloper_id%5D=cd950d34-5f99-43cb-b707-104d7d6f15fc&fields%5Biqt_token%5D=46f7565fe2ba42843b957cec6d783e48f85dff6d6ea56cf5753634b09a3214e8&reference-id=992366a2-5eea-4431-a559-5d26bc7f1436&environment-id=env_UWeuo2CnqFQXVeKujbQLBx6u';

/** Dev url for bridge terms of service */
const TOS_URL =
  'https://dashboard.bridge.xyz/accept-terms-of-service?customer_id=fdaf8561-32a1-4334-bc05-941f2cff7721';

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
  kyc_link: PERSONA_URL,
  tos_link: TOS_URL,
  kyc_status: 'not_started',
  tos_status: 'pending',
};
