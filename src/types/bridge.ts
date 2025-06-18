// Note: this is duplicated from the prisma generated type
/** A Bridge customer as it is stored in the database */
export type BridgeCustomer = {
  customer_id: string;
  kyc_link: string;
  tos_link: string;
  kyc_status: KYCStatus;
  tos_status: TOSStatus;

  virtual_account?: BridgeVirtualAccount;
  rejection_reasons?: RejectionReason[];

  customer: Customer;
};

// 👇 Supporting types

export type RejectionReason = {
  developer_reason: string;
  reason: string;
  created_at: string;
};

export type KYCStatus =
  | 'not_started'
  | 'pending' // deprecated, same as 'not_started'
  | 'incomplete'
  | 'awaiting_ubo'
  | 'manual_review' // deprecated, same as 'under_review'
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

/**
 * Represents a customer account from Bridge API
 * Generated with Cursor reading: https://apidocs.bridge.xyz/reference/get_customers-customerid
 * Updated with fields not present in docs but present in actual responses
 * Note: optionality is likely not correct.
 * Note: This should stay in sync with the type on the backend.
 */
export type Customer = {
  /** UID that uniquely identifies a resource */
  id: string;
  /** Customer's first name */
  first_name: string;
  /** Customer's last name */
  last_name: string;
  /** Customer's email address */
  email: string;
  /** Status of the customer's account */
  status:
    | 'active'
    | 'awaiting_questionnaire'
    | 'awaiting_ubo'
    | 'incomplete'
    | 'not_started'
    | 'offboarded'
    | 'paused'
    | 'rejected'
    | 'under_review';
  /** Customer capabilities object */
  type: 'individual';
  /** Not present in docs but present in responses */
  persona_inquiry_type: string;
  capabilities?: {
    /** State of the customer's pay-go crypto capability */
    payin_crypto: 'pending' | 'active' | 'inactive' | 'rejected';
    /** State of the customer's pay-go fiat capability */
    payin_fiat: 'pending' | 'active' | 'inactive' | 'rejected';
    /** State of the customer's payout crypto capability */
    payout_crypto: 'pending' | 'active' | 'inactive' | 'rejected';
    /** State of the customer's payout fiat capability */
    payout_fiat: 'pending' | 'active' | 'inactive' | 'rejected';
  };
  /** Description about requirements that may be needed in the future */
  future_requirements_due?: string[];
  /** KYC requirements still needed to be completed */
  requirements_due?: string[];
  /** Time of creation of the customer. ISO 8601. I.e. 2025-05-17T09:38:54.731Z */
  created_at: string;
  /** Time of last update of the customer. ISO 8601. I.e. 2025-05-17T09:38:54.731Z*/
  updated_at: string;
  /** Reasons why a customer was rejected by KYC */
  rejection_reasons: Array<{
    /** Developer information for why a customer was rejected */
    developer_reason: string;
    /** Reason for why a customer was rejected to be shared with the customer */
    reason: string;
    /** Time of creation of the rejection reason */
    created_at: string;
  }>;
  /** Whether the customer has accepted terms of service */
  has_accepted_terms_of_service: boolean;
  /** Approvals to complete onboarding or use certain products/services */
  endorsements: Array<{
    /** Name of the endorsement */
    name: 'base' | 'sepa' | 'spei';
    /** Status of the endorsement */
    status: 'incomplete' | 'approved' | 'revoked';
    /** Additional requirements to be completed for the approval */
    additional_requirements?: string[];
    /** Requirements object for the endorsement */
    requirements: {
      /** Array of requirements that have been completed */
      complete: string[];
      /** Array of requirements that are pending review */
      pending: string[];
      /** Object specifying in-depth breakdown of missing items */
      missing: ({ all_of: string[] } & object) | null;
      /** An array of issues preventing this endorsement from being approved. Values in this array can be either a string such as endorsement_not_available_in_customers_region or an object that correlates the issue to a particular field such as { id_front_photo: "id_expired" } */
      issues: (string | object)[];
    };
  }>;
};
