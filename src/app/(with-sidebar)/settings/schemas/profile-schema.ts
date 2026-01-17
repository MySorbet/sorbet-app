import { z } from 'zod';

export const profileSchema = z.object({
  // Basic info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  city: z.string().optional(),

  // Bio
  bio: z.string().max(50, 'Bio must be 50 characters or less').optional(),

  // Handle
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Handle can only contain lowercase letters, numbers, and dashes'
    )
    .optional(),

  // Tags (skills)
  tags: z.array(z.string()).max(5, 'Maximum 5 skills allowed').default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;


