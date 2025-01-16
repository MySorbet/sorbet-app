import axios from 'axios';

import { withAuthHeader } from '@/api/withAuthHeader';
import { env } from '@/lib/env';

// Should match backend
export type DashboardData = {
  tasks: {
    verified: boolean;
    invoice: boolean;
    profile: boolean;
    widget: boolean;
    payment: boolean;
  };

  invoiceSales: number;
  profileViews: number;
};

/**
 * Gets dashboard data for the authenticated user.
 *
 * No need to send an id because the user is already authed.
 */
export const getDashboardData = async () => {
  const res = await axios.get<DashboardData>(
    `${env.NEXT_PUBLIC_SORBET_API_URL}/dashboard`,
    await withAuthHeader()
  );
  return res.data;
};
