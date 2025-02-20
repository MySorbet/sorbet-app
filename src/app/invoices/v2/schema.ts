import { addDays, startOfDay } from 'date-fns';
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

// TODO: Revisit this and the form validation ot accepting today
/** `react-day-picker` matcher which allows any date after and including today */
export const isInTheFuture = (date: Date) => {
  const today = startOfDay(new Date());
  return date >= today;
};

/** Validator for the data of an invoice item */
export const InvoiceItemSchema = z.object({
  name: invoiceFormStringValidator('Item name'),
  quantity: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
});

/** Type of the data of an invoice item */
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;

/** Empty invoice item data */
export const emptyInvoiceItem: InvoiceItem = {
  name: '',
  quantity: 1,
  amount: 0,
};

/** Schema for the "Your info" section of an invoice form */
const yourInfoSchema = z.object({
  fromName: invoiceFormStringValidator('Name'),
  fromEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
});

/** The payment methods that a client can accept */
export const ACCEPTED_PAYMENT_METHODS = ['usdc', 'usd'] as const;
export type AcceptedPaymentMethod = (typeof ACCEPTED_PAYMENT_METHODS)[number];

const paymentMethodsSchema = z.object({
  paymentMethods: z.array(z.enum(ACCEPTED_PAYMENT_METHODS)).min(1),
});

/** Schema for the data of an invoice form */
export const invoiceFormSchema = z.object({
  // TODO: This is a temp adapter to work with existing invoice schema. should be replaced with client
  toName: invoiceFormStringValidator('Name'),
  toEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
  items: z.array(InvoiceItemSchema),
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
  ...paymentMethodsSchema.shape,
});

export type InvoiceForm = z.infer<typeof invoiceFormSchema>;

/** Schema for an address */
export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
});

export const emptyAddress: Address = {
  street: '',
  city: '',
  state: '',
  country: '',
  zip: '',
};

/** Schema for a client */
export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  address: addressSchema.optional(),
});

export type Client = z.infer<typeof clientSchema>;
export type Address = z.infer<typeof addressSchema>;

/** Default values for an invoice form if no prefills are provided */
export const defaultInvoiceValues: Required<InvoiceForm> = {
  issueDate: new Date(),
  dueDate: addDays(new Date(), 7),
  memo: '',
  items: [emptyInvoiceItem],
  invoiceNumber: '',
  tax: 0,
  fromName: '',
  fromEmail: '',
  toName: '',
  toEmail: '',
  paymentMethods: ['usdc'],
};
