export interface User {
  id: string;
  handle: string;
  privyId: string;
  hasClaimedHandle: boolean;

  tags: string[];

  // TODO: API type would have all these as key required but value nullable
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  city?: string;
}

/**
 *  Public endpoints return a subset of User, omitting private cols: `email`, `hasClaimedHandle`, `createdAt`, and `updatedAt`
 *
 *  This should match the UserService in sorbet-api.
 */
export type UserPublic = Pick<
  User,
  | 'id'
  | 'privyId'
  | 'firstName'
  | 'lastName'
  | 'handle'
  | 'bio'
  | 'city'
  | 'profileImage'
  | 'tags'
>;
