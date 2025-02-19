import { z } from 'zod';

// TODO: Note there are duplicates of v1 invoice stuff here. At the end of the day, there should only be one
/**
 * Build a zod string validator with a custom error message for use in a RHF FormField
 *
 * @param name - The name of the field
 * @param min - The minimum length of the field (default: 1)
 * @param max - The maximum length of the field (default: 50)
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

/** Validator for the data of an invoice item */
export const InvoiceItemDataSchema = z.object({
  name: invoiceFormStringValidator('Item name'),
  quantity: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
});
/** Type of the data of an invoice item */
export type InvoiceItemData = z.infer<typeof InvoiceItemDataSchema>;

/** Empty invoice item data */
export const emptyInvoiceItemData: InvoiceItemData = {
  name: '',
  quantity: 1,
  amount: 0,
};
