// Note: this is duplicated from the prisma generated type
/** A Bridge customer as it is stored in the database */
export type BridgeCustomer = {
  customer_id: string;
  kyc_link: string;
  tos_link: string;
  kyc_status: KYCStatus;
  tos_status: TOSStatus;

  virtual_account: BridgeVirtualAccount;
};

// 👇 Supporting types

export type KYCStatus =
  | 'not_started'
  | 'pending'
  | 'incomplete'
  | 'awaiting_ubo'
  | 'manual_review'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type TOSStatus = 'pending' | 'approved';

export type SourceDepositInstructions = {
  currency: string;
  bank_name: string;
  bank_address: string;
  bank_routing_number: string;
  bank_account_number: string;
  bank_beneficiary_name: string;
  bank_beneficiary_address: string;
  payment_rail: string;
  payment_rails: string[];
};

export type Destination = {
  currency: string;
  payment_rail: string;
  address: string;
};

export type BridgeVirtualAccount = {
  id: string;
  status: string;
  developer_fee_percent: string;
  customer_id: string;
  source_deposit_instructions: SourceDepositInstructions;
  destination: Destination;
};