export type DueAccount = {
  id: string;
  type?: 'individual' | 'business' | string;
  name?: string;
  email?: string;
  country?: string;
  category?: string;
  status?: string;
  statusLog?: Array<{ status: string; timestamp: string }>;
  kyc?: {
    status?: string;
    link?: string;
    rejectionReasons?: string[];
  };
  tos?: {
    id?: string;
    entityName?: string;
    status?: string;
    link?: string;
    documentLinks?: {
      tos?: string;
      privacyPolicy?: string;
    };
    acceptedAt?: string | null;
    token?: string;
  };
  [key: string]: unknown;
};

export type DueCustomer = {
  account_id: string;
  account: DueAccount;
  userId?: string | null;
};

export type DueVirtualAccount = {
  id: string;
  schema: DueVirtualAccountSchema;
  account: DueVirtualAccountData;
};

// Supported virtual account schemas
// bank_swift_usd is our internal schema for USD SWIFT 

export type DueVirtualAccountSchema =
  | 'bank_us'
  | 'bank_sepa'
  | 'bank_mena'
  | 'bank_uk'
  | 'bank_swift'
  | 'bank_swift_usd';

// Claimable schemas (can be created on-demand)
export type DueClaimableSchema = 'bank_us' | 'bank_sepa' | 'bank_mena';

// Beneficiary address structure used in bank_us and bank_mena
interface BeneficiaryAddress {
  street_line_1?: string;
  street_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  schema?: string;
}

// USD (bank_us) virtual account details
export interface DueVirtualAccountUSDetails {
  accountType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  bankName: string;
  bankAddress?: string;
  accountName?: string;
  accountNumber: string;
  routingNumber: string;
  routingNumberACH?: string;
  routingNumberWire?: string;
  routingNumberRTP?: string;
  beneficiaryAddress?: BeneficiaryAddress;
  schema?: string;
}

// EUR (bank_sepa) virtual account details
export interface DueVirtualAccountEURDetails {
  accountType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  IBAN: string;
  bankName?: string;
  swiftCode?: string;
  schema?: string;
}

// AED (bank_mena) virtual account details
export interface DueVirtualAccountAEDDetails {
  accountType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  bankName?: string;
  IBAN: string;
  swiftCode?: string;
  beneficiaryAddress?: BeneficiaryAddress;
  schema?: string;
}

// GBP (bank_uk) virtual account details
export interface DueVirtualAccountGBPDetails {
  accountType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  bankName?: string;
  accountNumber: string;
  sortCode: string;
  schema?: string;
}

// SWIFT (bank_swift) virtual account details
export interface DueVirtualAccountSWIFTDetails {
  accountType: 'individual' | 'business';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  bankName: string;
  swiftCode: string;
  swiftAccountNumber: string;
  currency: string;
  country: string;
  beneficiaryAddress?: BeneficiaryAddress;
  schema?: string;
}

// Full virtual account data structure (as returned from Due API)
export interface DueVirtualAccountData {
  key?: string;
  memo?: string | null;
  details:
  | DueVirtualAccountUSDetails
  | DueVirtualAccountEURDetails
  | DueVirtualAccountAEDDetails
  | DueVirtualAccountGBPDetails
  | DueVirtualAccountSWIFTDetails;
  ownerId?: string;
  railOut?: string;
  isActive?: boolean;
  schemaIn?: string;
  walletId?: string;
  createdAt?: string;
  reference?: string;
  currencyIn?: string;
  currencyOut?: string;
  destination?: string;
  applicationFeeBps?: number;
  applicationFeeAmount?: string;
}

// Type guards for virtual account details
export function isUSDetails(
  details: DueVirtualAccountData['details']
): details is DueVirtualAccountUSDetails {
  return 'routingNumber' in details;
}

export function isEURDetails(
  details: DueVirtualAccountData['details']
): details is DueVirtualAccountEURDetails {
  return 'IBAN' in details && !('swiftCode' in details && 'bankName' in details);
}

export function isAEDDetails(
  details: DueVirtualAccountData['details']
): details is DueVirtualAccountAEDDetails {
  return 'IBAN' in details && 'beneficiaryAddress' in details;
}

export function isGBPDetails(
  details: DueVirtualAccountData['details']
): details is DueVirtualAccountGBPDetails {
  return 'sortCode' in details;
}

