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
}

/** Type to capture the fact that a user can have an id but not the rest of the user object */
export type UserWithId = Partial<User> & Pick<User, 'id'>;
