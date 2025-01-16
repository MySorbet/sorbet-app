import { http } from 'msw';
import { delay } from 'msw';
import { HttpResponse } from 'msw';

import { env } from '@/lib/env';

import { DashboardData } from './dashboard';

/**
 * Mock the data from the `/dashboard` endpoint
 */
export const mockDashboardHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/dashboard`,
  async () => {
    await delay();
    return HttpResponse.json<DashboardData>({
      tasks: {
        verified: true,
        invoice: true,
        profile: true,
        widget: false,
        payment: false,
      },
      invoiceSales: 1000.01,
      profileViews: 25,
    });
  }
);

/**
 * Mock the data from the `/dashboard` endpoint with all tasks complete
 */
export const mockDashboardHandlerAllTasksComplete = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/dashboard`,
  async () => {
    await delay();
    return HttpResponse.json<DashboardData>({
      tasks: {
        verified: true,
        invoice: true,
        profile: true,
        widget: true,
        payment: true,
      },
      invoiceSales: 1000.01,
      profileViews: 25,
    });
  }
);
