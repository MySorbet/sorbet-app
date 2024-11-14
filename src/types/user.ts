export interface User {
  id: string;
  firstName: string;
  lastName: string;
  accountId: string | null;
  privyId: string | null;
  handle: string | null;
  email: string;
  bio: string;
  title: string;
  profileImage: string;
  profileBannerImage: string;
  tags: string[];
  tempLocation: string;
  city: string;
  balance?: {
    usdc: number;
    near: number;
    nearUsd: number;
  };
  bridgeCustomer?: BridgeCustomer;
}

/** Type to capture the fact that a user can have an id but not the rest of the user object */
export type UserWithId = Partial<User> & Pick<User, 'id'>;

// All bridge types below should match the backend BridgeCustomer type
export type BridgeCustomer = {
  customer_id: string;
  kyc_link: string;
  tos_link: string;
  kyc_status: KYCStatus;
  tos_status: TOSStatus;
};

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
