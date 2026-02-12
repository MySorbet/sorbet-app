import { delay, http, HttpResponse } from 'msw';

import { env } from '@/lib/env';
import type { DueCustomer } from '@/types/due';

/** Mock Due customer - not started verification */
export const mockDueCustomerNotStarted: DueCustomer = {
  account_id: 'acct_mock123',
  account: {
    id: 'acct_mock123',
    type: 'individual',
    name: 'Test User',
    email: 'test@example.com',
    country: 'US',
    category: 'employed',
    status: 'active',
    statusLog: [],
    kyc: {
      status: 'pending',
      link: '/api/bp/redirect/kyc/sumsub/mock_kyc_link',
    },
    tos: {
      id: 'ta_mock123',
      entityName: 'Due Payments EOOD',
      status: 'pending',
      link: '/tos/mock_tos_link',
      documentLinks: {
        tos: 'https://example.com/tos.pdf',
        privacyPolicy: 'https://example.com/privacy.pdf',
      },
      token: 'mock_token',
    },
  },
};

/** Mock Due customer - TOS accepted, KYC pending */
export const mockDueCustomerTosAccepted: DueCustomer = {
  ...mockDueCustomerNotStarted,
  account: {
    ...mockDueCustomerNotStarted.account,
    tos: {
      ...mockDueCustomerNotStarted.account.tos,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    },
  },
};

/** Mock Due customer - KYC under review */
export const mockDueCustomerUnderReview: DueCustomer = {
  ...mockDueCustomerNotStarted,
  account: {
    ...mockDueCustomerNotStarted.account,
    kyc: {
      status: 'under_review',
      link: '/api/bp/redirect/kyc/sumsub/mock_kyc_link',
    },
    tos: {
      ...mockDueCustomerNotStarted.account.tos,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    },
  },
};

/** Mock Due customer - KYC passed (verified) */
export const mockDueCustomerVerified: DueCustomer = {
  ...mockDueCustomerNotStarted,
  account: {
    ...mockDueCustomerNotStarted.account,
    kyc: {
      status: 'passed',
      link: '/api/bp/redirect/kyc/sumsub/mock_kyc_link',
    },
    tos: {
      ...mockDueCustomerNotStarted.account.tos,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    },
  },
};

/** Mock Due customer - KYC rejected */
export const mockDueCustomerRejected: DueCustomer = {
  ...mockDueCustomerNotStarted,
  account: {
    ...mockDueCustomerNotStarted.account,
    kyc: {
      status: 'rejected',
      link: '/api/bp/redirect/kyc/sumsub/mock_kyc_link',
      rejectionReasons: ['Identity verification failed. Please try again.'],
    },
    tos: {
      ...mockDueCustomerNotStarted.account.tos,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    },
  },
};

/** MSW Handler - Due customer not started */
export const mockDueCustomerHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerNotStarted);
  }
);

/** MSW Handler - Due customer 404 (not created yet) */
export const mockDueCustomerHandler404 = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json(
      {
        error: 'Due customer not found',
      },
      {
        status: 404,
      }
    );
  }
);

/** MSW Handler - Due customer TOS accepted */
export const mockDueCustomerHandlerTosAccepted = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerTosAccepted);
  }
);

/** MSW Handler - Due customer under review */
export const mockDueCustomerHandlerUnderReview = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerUnderReview);
  }
);

/** MSW Handler - Due customer verified */
export const mockDueCustomerHandlerVerified = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerVerified);
  }
);

/** MSW Handler - Due customer rejected */
export const mockDueCustomerHandlerRejected = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerRejected);
  }
);

/** MSW Handler - Create Due customer (verify endpoint) */
export const mockVerifyDueHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/due/verify`,
  async () => {
    await delay(1000);
    return HttpResponse.json<DueCustomer>(mockDueCustomerNotStarted);
  }
);
