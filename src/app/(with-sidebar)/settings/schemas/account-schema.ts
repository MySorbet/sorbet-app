import { z } from 'zod';

export const accountSchema = z.object({
  // Invoicing
  businessName: z.string().optional(),
  taxId: z.string().optional(),
  street: z.string().optional(),
  state: z.string().optional(),
  addressCity: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
