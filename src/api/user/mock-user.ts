import { MinimalUser, User } from '@/types';

export const mockUserMinimal: MinimalUser = {
  id: '1',
  privyId: 'mock-privy-id',
  handle: 'mock-user',
  hasClaimedHandle: false,
};

export const mockUser: User = {
  id: '1',
  privyId: 'mock-privy-id',
  handle: 'mock-user',
  firstName: 'Mock',
  lastName: 'User',
  email: 'mock@example.com',
  bio: 'Mock bio',
  profileImage: '',
  tags: ['tag1', 'tag2', 'tag3'],
  city: 'New York',
  hasClaimedHandle: false,
};

export const mockUserWithProfileImage = {
  ...mockUser,
  profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
};
