export interface User {
  id: string;
  firstName: string;
  lastName: string;
  accountId: string;
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
