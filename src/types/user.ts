export interface User {
  id: string;
  firstName: string;
  lastName: string;
  privyId: string | null;
  handle: string;
  email: string;
  bio: string;
  profileImage: string;
  tags: string[];
  city: string;

  hasClaimedHandle: boolean;
}

/** Type to capture the fact that a user can have an id but not the rest of the user object */
export type UserWithId = Partial<User> & Pick<User, 'id'>;

// TODO, this should actually be the regular user type -- update eventually
/**
 * Type to capture the most minimal version of a user
 * - In the future to not even have handle
 * - email will likely be defined (but its possible with a google login that we don't (however, this is a bug and we should fix it) )
 */
export type MinimalUser = Pick<
  User,
  'id' | 'handle' | 'privyId' | 'hasClaimedHandle'
> &
  Partial<User>;
