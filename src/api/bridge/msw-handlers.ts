import { delay, http, HttpResponse } from 'msw';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { env } from '@/lib/env';
import { SourceDepositInstructions } from '@/types';

export const mockACHWireDetailsHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/users/*/ach`,
  async () => {
    await delay();
    return HttpResponse.json<SourceDepositInstructions>(
      mockBridgeCustomer.virtual_account?.source_deposit_instructions
    );
  }
);
