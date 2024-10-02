import { z } from 'zod';

import { checkHandleIsAvailable } from '@/api/auth';
import { UserWithId } from '@/types';

// TODO: debounce so that not too many requests are made when typing
const refine = async (handle: string, initialHandle: string) => {
  if (handle === initialHandle) return true; // initial handle generated for this user is allowed
  if (handle.length === 0) return false;
  const res = await checkHandleIsAvailable(handle);
  return res.data.isUnique;
};

/**
 * This returns a zod schema for a user's handle. It uses a custom 'refine' function to check username availability
 * @param user
 * @returns zod schema for handle
 */
export const handleValidation = (user: UserWithId | null) => {
  if (!user) {
    throw new Error('User not found');
  }

  const handleSchema = z
    .string()
    .min(1, { message: 'Handle is required' })
    .max(25, { message: 'Handle must be less than 25 characters' })
    .regex(/^[a-z0-9-_]+$/, {
      message:
        'Handle may only contain lowercase letters, numbers, dashes, and underscores',
    }) // Enforce lowercase, no spaces, and allow dashes
    .refine((handle) => refine(handle, user?.handle ?? ''), {
      message: 'This handle is already taken',
    });

  return handleSchema;
};
