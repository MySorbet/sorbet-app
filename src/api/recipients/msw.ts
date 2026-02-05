import { delay, http } from 'msw';
import { HttpResponse } from 'msw';

import { mockRecipients } from '@/api/recipients/mock';
import { CreateRecipientDto, type RecipientAPI } from '@/api/recipients/types';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

// We'll mock a db store by just mutating a file scope variable
const recipients = [...mockRecipients];

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

    if (data.type === 'usd' || data.type === 'eur') {
      const mockRecipient = data.type === 'usd' ? mockRecipients[0] : mockRecipients[1];
      const recipient: RecipientAPI = {
        ...mockRecipient,
        type: data.type,
        label: data.values.account_owner_name,
        detail:
          data.type === 'usd'
            ? data.values.account?.account_number ?? ''
            : data.values.iban?.account_number ?? '',
      } as RecipientAPI;
      recipients.push(recipient);
      return HttpResponse.json(recipient);
    }

    const mockRecipient = mockRecipients[2];
    const recipient: RecipientAPI = {
      ...mockRecipient,
      type: data.type,
      walletAddress: data.values.walletAddress,
      label: data.values.label,
      detail: data.values.walletAddress,
    } as RecipientAPI;
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
