export interface User {
  id: string;
  firstName: string;
  lastName: string;
  privyId: string | null;
  handle: string | null;
  email: string;
  bio: string;
  profileImage: string;
  tags: string[];
  city: string;
}

/** Type to capture the fact that a user can have an id but not the rest of the user object */
export type UserWithId = Partial<User> & Pick<User, 'id'>;
