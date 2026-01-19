import { delay, http, HttpResponse } from 'msw';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { env } from '@/lib/env';
import { BridgeCustomer, SourceDepositInstructions } from '@/types';

export const mockACHWireDetailsHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/*/ach`,
  async () => {
    await delay();
    return HttpResponse.json<SourceDepositInstructions>(
      mockBridgeCustomer.virtual_account?.source_deposit_instructions
    );
  }
);

export const mockBridgeCustomerHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>(mockBridgeCustomer);
  }
);

export const mockBridgeCustomerHandlerTosComplete = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              status: 'incomplete',
              has_accepted_terms_of_service: true,
            }
          : undefined,
    });
  }
);

export const mockBridgeCustomerHandlerKycComplete = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              has_accepted_terms_of_service: true,
              status: 'active',
              endorsements: [
                {
                  name: 'base',
                  status: 'approved',
                  requirements: {
                    complete: [],
                    pending: [],
                    missing: null,
                    issues: [],
                  },
                },
                {
                  name: 'sepa',
                  status: 'incomplete',
                  requirements: {
                    complete: [],
                    pending: [],
                    missing: null,
                    issues: [],
                  },
                },
              ],
            }
          : undefined,
    });
  }
);

export const mockBridgeCustomerHandlerKycCompleteWithSepa = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              has_accepted_terms_of_service: true,
              status: 'active',
              endorsements: [
                {
                  name: 'base',
                  status: 'approved',
                  requirements: {
                    complete: [],
                    pending: [],
                    missing: null,
                    issues: [],
                  },
                },
                {
                  name: 'sepa',
                  status: 'approved',
                  requirements: {
                    complete: [],
                    pending: [],
                    missing: null,
                    issues: [],
                  },
                },
              ],
            }
          : undefined,
    });
  }
);

export const mockBridgeCustomerHandler404 = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json(
      {
        error: 'Bridge customer not found',
      },
      {
        status: 404,
      }
    );
  }
);

export const mockVerifyHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/verify`,
  async () => {
    await delay();
    return HttpResponse.json<BridgeCustomer>(mockBridgeCustomer);
  }
);

export const mockBridgeCustomerHandlerRejected = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              has_accepted_terms_of_service: true,
              status: 'rejected',
              rejection_reasons: [
                { reason: 'Cannot validate ID -- please upload a clear photo of the full ID.' },
              ],
            }
          : undefined,
    });
  }
);

export const mockBridgeCustomerHandlerUnderReview = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              has_accepted_terms_of_service: true,
              status: 'under_review',
            }
          : undefined,
    });
  }
);

export const mockBridgeCustomerHandlerIncomplete = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
  async () => {
    await delay(1000);
    return HttpResponse.json<BridgeCustomer>({
      ...mockBridgeCustomer,
      customer:
        mockBridgeCustomer.customer !== undefined
          ? {
              ...mockBridgeCustomer.customer,
              has_accepted_terms_of_service: true,
              status: 'incomplete',
            }
          : undefined,
    });
  }
);
