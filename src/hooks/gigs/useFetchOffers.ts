import { useQuery } from '@tanstack/react-query';

import { getClientOffers, getFreelancerOffers } from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { GigsContentType, UserWithId } from '@/types';

export const useFetchOffers = (
  loggedInUser: UserWithId | null,
  gigsContentType: GigsContentType,
  status: string
) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      if (loggedInUser?.id) {
        let response: any;

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
          toast({
            title: 'Failed to fetch offers',
            description: 'Try again. If this issue persists, contact support.',
          });
        }
      }
    },
    enabled: !!loggedInUser,
  });
};
