import { startOfDay } from 'date-fns';
import { z } from 'zod';

import { checkInvoiceNumber } from '@/api/invoices';

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

const yourInfoSchema = z.object({
  fromName: invoiceFormStringValidator('Name'),
  fromEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
});

// react-day-picker Matcher which allows any date after and including today
// TODO: Revisit this and the form validation ot accepting today
export const isInTheFuture = (date: Date) => {
  const today = startOfDay(new Date());
  return date >= today;
};

export const schema = z.object({
  // TODO: This is a temp adapter to work with existing invoice schema. should be replaced with client card
  toName: invoiceFormStringValidator('Name'),
  toEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
  items: z.array(InvoiceItemDataSchema),
  invoiceNumber: invoiceFormStringValidator('Invoice number').refine(
    async (invoiceNumber) => {
      // No need to call the API for empty strings
      if (!invoiceNumber) return true;
      const { isAvailable } = await checkInvoiceNumber(invoiceNumber);
      return isAvailable;
    },
    // TODO: can we make a recommendation from the error state?
    { message: "You've already used this invoice number" }
  ),
  tax: z.coerce.number().min(0).max(100).optional(),
  issueDate: z
    .date({ required_error: 'An issue date is required.' })
    .refine(isInTheFuture, {
      message: 'Issue date must be today or a future date.',
    }),
  dueDate: z
    .date({ required_error: 'A due date is required.' })
    .refine(isInTheFuture, {
      message: 'Due date must be a future date',
    }),
  memo: z.string().max(800, 'Memo must be less than 800 characters').optional(), // Note: this max should match backend validation
  ...yourInfoSchema.shape,
});

export type InvoiceFormData = z.infer<typeof schema>;
