import { useQuery } from '@tanstack/react-query';

export const useCheckIsAccountAvailable = () => {

  return useQuery({
    queryKey: ['account-available'],
    queryFn: async () =>
  })
}
