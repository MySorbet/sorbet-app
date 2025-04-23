export interface User {
  id: string;
  handle: string;
  privyId: string | null; // TODO: I think this should be non-nullable and change in the schema too
  hasClaimedHandle: boolean;

  // TODO: API type would have all these as nullable by required
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  tags?: string[];
  city?: string;
}

// TODO: This is the only User type currently. But soon, we should distinguish between the public user and the full user
