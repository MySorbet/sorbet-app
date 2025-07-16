import {
  BridgeCustomer,
  BridgeVirtualAccount,
  BridgeVirtualAccountEUR,
  Customer,
} from '@/types/bridge';

/** Dev url for Persona */
const PERSONA_URL =
  'https://bridge.withpersona.com/verify?inquiry-template-id=itmpl_NtHYpb9AbEYCPxGo5iRbc9d2&fields%5Bdeveloper_id%5D=cd950d34-5f99-43cb-b707-104d7d6f15fc&fields%5Biqt_token%5D=46f7565fe2ba42843b957cec6d783e48f85dff6d6ea56cf5753634b09a3214e8&reference-id=992366a2-5eea-4431-a559-5d26bc7f1436&environment-id=env_UWeuo2CnqFQXVeKujbQLBx6u';

/** Dev url for bridge terms of service */
const TOS_URL =
  'https://dashboard.bridge.xyz/accept-terms-of-service?customer_id=fdaf8561-32a1-4334-bc05-941f2cff7721';

const mockVirtualAccountUSD: BridgeVirtualAccount = {
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
};

const mockVirtualAccountEUR: BridgeVirtualAccountEUR = {
  id: 'mock-virtual-account-id',
  status: 'activated',
  customer_id: 'mock-customer-id',
  destination: {
    address: '0x001321f31f873e51234801e5d8ba53ab22751234',
    currency: 'usdc',
    payment_rail: 'base',
  },
  developer_fee_percent: '1.0',
  source_deposit_instructions: {
    bic: 'MODRIE22YYY',
    iban: 'IE33MODR99035508481234',
    currency: 'eur',
    bank_name: 'Modulr Finance, Ireland Branch',
    bank_address: 'Floor 6, 2 Grand Canal Square, Dublin, Ireland',
    payment_rail: 'sepa',
    payment_rails: ['sepa'],
    account_holder_name: 'Bridge Building Sp.z.o.o.',
  },
};

const customer: Customer = {
  id: 'e2895ee1-1f20-42c8-9552-41e87dee911d',
  type: 'individual',
  email: 'joah@sorbet.xyz',
  status: 'active',
  last_name: 'JOHNSON',
  created_at: '2025-06-18T19:39:34.042Z',
  first_name: 'JOAH',
  updated_at: '2025-06-18T20:05:39.156Z',
  endorsements: [
    {
      name: 'base',
      status: 'approved',
      requirements: {
        issues: [],
        missing: null,
        pending: [],
        complete: [
          'terms_of_service_v1',
          'first_name',
          'last_name',
          'tax_identification_number',
          'email_address',
          'address_of_residence',
          'date_of_birth',
          'database_lookup',
          'government_id_verification',
          'sanctions_screen',
          'pep_screen',
        ],
      },
    },
    {
      name: 'sepa',
      status: 'approved',
      requirements: {
        issues: [],
        missing: null,
        pending: [],
        complete: [
          'terms_of_service_v2',
          'first_name',
          'last_name',
          'tax_identification_number',
          'email_address',
          'address_of_residence',
          'date_of_birth',
          'database_lookup',
          'government_id_verification',
          'sanctions_screen',
          'pep_screen',
        ],
      },
    },
  ],
  rejection_reasons: [],
  persona_inquiry_type: 'gov_id_db_selfie',
  has_accepted_terms_of_service: false,
};

export const mockBridgeCustomer: BridgeCustomer = {
  hasClaimedVirtualAccount: true,
  hasClaimedVirtualAccountEur: true,
  virtual_account: mockVirtualAccountUSD,
  virtual_account_eur: mockVirtualAccountEUR,
  customer_id: '220d5e70-48f9-4971-b547-c19b93d2ba1c',
  kyc_link: PERSONA_URL,
  tos_link: TOS_URL,
  kyc_status: 'not_started',
  tos_status: 'pending',
  customer,
};
