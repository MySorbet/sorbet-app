import { delay, http, HttpResponse } from 'msw';

import { sampleInvoices } from '@/app/invoices/components/dashboard/sample-invoices';
import { Invoice } from '@/app/invoices/components/dashboard/utils';
import { env } from '@/lib/env';

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
 * Just gives the first sample invoice
 */
export const mockInvoiceHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/invoices/:id`,
  async () => {
    await delay();
    return HttpResponse.json(sampleInvoices[0]);
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
