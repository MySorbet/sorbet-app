import axios from 'axios';

import { Invoice, InvoiceForm } from '@/app/invoices/v2/schema';
import { env } from '@/lib/env';

import { withAuthHeader } from '../withAuthHeader';

/**
 * Creates a new invoice.
 *
 * @param invoice - The invoice form data to create with
 * @returns The created invoice
 */
export const createInvoice = async (invoice: InvoiceForm) => {
  const res = await axios.post<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
    invoice,
    await withAuthHeader()
  );
  return res.data;
};

/**
 * Gets all invoices for the authenticated user.
 *
 * No need to send an id because the user is already authed.
 */
export const getInvoices = async () => {
  const res = await axios.get<Invoice[]>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
    await withAuthHeader()
  );
  return res.data;
};

/**
 * Gets a single invoice by id.
 *
 * @param id - The id of the invoice to get
 *
 * Note: we do not send the auth header because this is a public endpoint
 */
export const getInvoice = async (id: string) => {
  const res = await axios.get<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}`
  );
  return res.data;
};

/**
 * Cancels an invoice.
 *
 * @param id - The id of the invoice to cancel
 * @returns The cancelled invoice
 */
export const cancelInvoice = async (id: string) => {
  const res = await axios.put<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}/cancel`,
    {}, // No data on the put, just hitting the endpoint cancels the invoice
    await withAuthHeader()
  );
  return res.data;
};

/**
 * Marks an invoice as paid.
 *
 * @param id - The id of the invoice to mark as paid
 * @returns The paid invoice
 */
export const payInvoice = async (id: string) => {
  const res = await axios.put<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}/paid`,
    {}, // No data on the put, just hitting the endpoint marks the invoice as paid
    await withAuthHeader()
  );
  return res.data;
};

/**
 * Marks an invoice as open.
 *
 * @param id - The id of the invoice to mark as open
 * @returns The opened invoice
 */
export const openInvoice = async (id: string) => {
  const res = await axios.put<Invoice>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/${id}/open`,
    {}, // No data on the put, just hitting the endpoint opens the invoice
    await withAuthHeader()
  );
  return res.data;
};

// Should match the API response from `/invoices/check-number`
type CheckInvoiceNumberResponse = {
  isAvailable: boolean;
  recommendation?: string;
};

/**
 * Checks if an invoice number is available and gets recommendations if needed.
 *
 * @param invoiceNumber - Optional invoice number to check. If not provided, will only return recommendations
 * @returns Object containing availability status and recommended number if applicable
 */
export const checkInvoiceNumber = async (invoiceNumber?: string) => {
  const res = await axios.get<CheckInvoiceNumberResponse>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/check-number`,
    await withAuthHeader({
      params: {
        invoiceNumber,
      },
    })
  );
  return res.data;
};
