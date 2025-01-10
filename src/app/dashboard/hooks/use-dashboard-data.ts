import { useQuery } from '@tanstack/react-query';

import { getDashboardData } from '@/api/dashboard';

export const useDashboardData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });
  return { data, isLoading };
};
