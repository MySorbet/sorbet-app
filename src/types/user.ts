export interface User {
  id: string;
  handle: string;
  privyId: string | null;
  hasClaimedHandle: boolean;

  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  tags?: string[];
  city?: string;
}
