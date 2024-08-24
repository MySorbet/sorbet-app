export interface User {
  id: string;
  firstName: string;
  lastName: string;
  accountId: string;
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
}
