import { delay, http, HttpResponse } from 'msw';

import { env } from '@/lib/env';
import {
  TransactionOverview,
  TransactionsResponse,
} from '@/types/transactions';

import { sampleTransactions } from './sample-transactions';

export const mockTransactionsHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/transactions`,
  async () => {
    await delay();
    return HttpResponse.json<TransactionsResponse>({
      transactions: sampleTransactions,
      cursor: '1',
    });
  }
);

export const mockOverviewHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/transactions/overview`,
  async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const _account = params.get('account');
    const _lastDays = params.get('last_days');
    await delay();
    return HttpResponse.json<TransactionOverview>({
      money_in: sampleTransactions,
      money_out: sampleTransactions,
      transactions: sampleTransactions,
      total_money_in: '100',
      total_money_out: '100',
    });
  }
);

export const mockOverviewHandlerNoTransactions = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/transactions/overview`,
  async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const _account = params.get('account');
    const _lastDays = params.get('last_days');
    await delay();
    return HttpResponse.json<TransactionOverview>({
      money_in: [],
      money_out: [],
      transactions: [],
      total_money_in: '0',
      total_money_out: '0',
    });
  }
);
