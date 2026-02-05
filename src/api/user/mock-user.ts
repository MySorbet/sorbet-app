import { User, UserPublic } from '@/types';

export const mockUserMinimal: User = {
  id: '1',
  privyId: 'mock-privy-id',
  handle: 'mock-user',
  hasClaimedHandle: true,
  tags: [],
};

export const mockUser: User = {
  ...mockUserMinimal,
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@example.com',
  bio: 'Mock bio',
  profileImage: '',
  tags: ['tag1', 'tag2', 'tag3'],
  city: 'New York',
  category: 'employed',
  customerType: 'individual',
};

export const mockUserWithProfileImage = {
  ...mockUser,
  profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
};

export const mockUserPublic: UserPublic = {
  id: '1',
  privyId: 'mock-privy-id',
  handle: 'mock-user',
  firstName: 'Mock',
  lastName: 'User',
  bio: 'Mock bio',
  profileImage: '',
  tags: ['tag1', 'tag2', 'tag3'],
  city: 'New York',
};
