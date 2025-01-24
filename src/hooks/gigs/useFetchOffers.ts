import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getClientOffers, getFreelancerOffers } from '@/api/gigs';
import { GigsContentType, UserWithId } from '@/types';

export const useFetchOffers = (
  loggedInUser: UserWithId | null,
  gigsContentType: GigsContentType,
  status: string
) => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      if (loggedInUser?.id) {
        let response;

        switch (gigsContentType) {
          case GigsContentType.Sent:
            response = await getClientOffers(loggedInUser?.id, status);
            break;
          case GigsContentType.Received:
            response = await getFreelancerOffers(loggedInUser?.id, status);
            break;
        }

        if (response?.data) {
          return response.data;
        } else {
          toast.error('Failed to fetch offers', {
            description: 'Try again. If this issue persists, contact support.',
          });
        }
      }
    },
    enabled: !!loggedInUser,
  });
};
