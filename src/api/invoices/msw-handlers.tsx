import { delay, http, HttpResponse } from 'msw';

import { Invoice } from '@/app/invoices/components/dashboard/utils';
import { sampleInvoices } from '@/app/invoices/components/dashboard/sample-invoices';
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
      status: 'open', // ... and a status
    });
  }
);
