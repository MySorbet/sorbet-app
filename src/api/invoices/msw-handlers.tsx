import { delay, http, HttpResponse } from 'msw';

import { Invoice } from '@/app/invoices/v2/schema';
import { env } from '@/lib/env';

import { sampleInvoices } from './sample-invoices';

/**
 * Mock the data from the `/invoices` endpoint
 */
export const mockInvoicesHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
  async () => {
    await delay();
    return HttpResponse.json(sampleInvoices);
  }
);

/**
 * Mock the data from the `/invoices/:id` endpoint
 * Just gives the third sample invoice
 */
export const mockInvoiceHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/:id`,
  async () => {
    await delay();
    return HttpResponse.json(sampleInvoices[2]);
  }
);

/**
 * Mock the data from the `/invoices/:id` endpoint
 * Return a 404 error
 */
export const mockInvoiceNotFoundHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/:id`,
  async () => {
    await delay();
    return HttpResponse.json(
      { message: 'Invoice not found', statusCode: 404 },
      { status: 404 }
    );
  }
);

/**
 * Mock the data from posting to the `/invoices` endpoint
 * TODO: Not sure if this works yet
 */
export const mockCreateInvoiceHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices`,
  async ({ request }) => {
    const invoice = (await request.json()) as Invoice; // TODO: Bad cast but this is just mocking
    await delay();
    return HttpResponse.json({
      ...invoice,
      id: '3f7af738-5d50-4d62-9fe9-1e2c1c8b9e9a', // When an invoice is created, we mock adding an id...
      status: 'Open', // ... and a status
      userId: '123', // ... and a userId
      totalAmount: 100, // ... and a totalAmount
    });
  }
);

/**
 * Mock the data from the `/invoices/:id/cancel` endpoint
 */
export const mockCancelInvoiceHandler = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/*/cancel`,
  async () => {
    await delay();
    return HttpResponse.json({ ...sampleInvoices[0], status: 'Cancelled' });
  }
);

/**
 * Mock the data from the `/invoices/:id/paid` endpoint
 */
export const mockPayInvoiceHandler = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/*/paid`,
  async () => {
    await delay();
    return HttpResponse.json({ ...sampleInvoices[0], status: 'Paid' });
  }
);

/**
 * Mock the data from the `/users/:userId/wallet` endpoint
 * // TODO: This should live in a different file (like /user/msw-handlers.tsx)
 */
export const mockCurrentWalletAddressHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/*/wallet`,
  async () => {
    await delay();
    return HttpResponse.json('0x1234567890123456789012345678901234567890');
  }
);

/**
 * Mock the data from the `/invoices/check-number` endpoint
 *
 * Will report that INV-001, INV-002, and INV-003 are not available
 * and will recommend INV-REC
 */
export const mockCheckInvoiceNumberHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/check-number`,
  async ({ request }) => {
    const invoiceNumber = new URL(request.url).searchParams.get(
      'invoiceNumber'
    );
    await delay();
    return HttpResponse.json({
      isAvailable: invoiceNumber
        ? !['INV-001', 'INV-002', 'INV-003'].includes(invoiceNumber)
        : true,
      recommendation: 'INV-REC',
    });
  }
);
