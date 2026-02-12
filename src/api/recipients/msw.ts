import { delay, http } from 'msw';
import { HttpResponse } from 'msw';

import { mockRecipients } from '@/api/recipients/mock';
import {
  CreateRecipientDto,
  type DuePaymentMethod,
} from '@/api/recipients/types';
import type { BankRecipientFormValues } from '@/app/(with-sidebar)/recipients/components/bank-recipient-form';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

// We'll mock a db store by just mutating a file scope variable
const recipients = [...mockRecipients];

function getBankLabel(values: BankRecipientFormValues): string {
  if (values.accountType === 'individual') {
    return [values.firstName, values.lastName].filter(Boolean).join(' ').trim();
  }
  return values.companyName ?? '';
}

function getBankDetail(values: BankRecipientFormValues): string {
  if (['usd_ach', 'usd_wire'].includes(values.paymentMethod)) {
    const num = values.usBank?.accountNumber ?? '';
    return num.slice(-4);
  }
  if (['usd_swift', 'eur_swift'].includes(values.paymentMethod)) {
    const num = values.swift?.swiftAccountNumber ?? '';
    return num.slice(-4);
  }
  if (['eur_sepa', 'aed_local'].includes(values.paymentMethod)) {
    const num = values.iban?.IBAN ?? '';
    return num.slice(-4);
  }
  return '';
}

function getMockRecipientForType(
  type: DuePaymentMethod | 'usd' | 'eur' | 'crypto'
) {
  if (type === 'crypto') return mockRecipients[2];
  if (type === 'usd' || type.startsWith('usd_')) return mockRecipients[0];
  return mockRecipients[1];
}

export const getRecipientsHandler = http.get(
  `${API_URL}/recipients`,
  async () => {
    await delay();
    return HttpResponse.json(recipients);
  }
);

export const createRecipientHandler = http.post(
  `${API_URL}/recipients`,
  async ({ request }) => {
    await delay();
    const data = (await request.json()) as CreateRecipientDto;
    const mockRecipient = getMockRecipientForType(data.type);
    const recipient = {
      ...mockRecipient,
      ...(data.type === 'crypto'
        ? {
            walletAddress: data.values.walletAddress,
            label: data.values.label,
            detail: data.values.walletAddress,
          }
        : {
            ...mockRecipient,
            label: getBankLabel(data.values),
            detail: getBankDetail(data.values),
          }),
    };
    recipients.push(recipient);
    return HttpResponse.json(recipient);
  }
);

export const createRecipientHandlerFailure = http.post(
  `${API_URL}/recipients`,
  async () => {
    await delay();
    return HttpResponse.json(
      { error: 'Failed to create recipient' },
      { status: 500 }
    );
  }
);

export const handlers = (failure: boolean) => [
  getRecipientsHandler,
  failure ? createRecipientHandlerFailure : createRecipientHandler,
];
