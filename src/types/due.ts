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
  schema: string;
  account: Record<string, unknown>;
};
