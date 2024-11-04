import { z } from 'zod';

/**
 * Build a zod string validator with a custom error message for use in a RHF FormField
 *
 * @param name - The name of the field
 * @param min - The minimum length of the field
 * @param max - The maximum length of the field
 * @returns A zod string validator enforcing the above constraints
 */
export const invoiceFormStringValidator = (name: string, min = 1, max = 50) =>
  z
    .string({
      errorMap: () => ({
        message: `${name} must be between ${min} and ${max} characters`,
      }),
    })
    .min(min)
    .max(max);
