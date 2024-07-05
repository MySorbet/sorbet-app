import { useAuth } from '../useAuth';
import { getClientOffers, getFreelancerOffers } from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { GigsContentType, User } from '@/types';
import { FormattedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useFetchOffers = (
  loggedInUser: User | null,
  gigsContentType: GigsContentType,
  status: string
) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      if (loggedInUser?.accountId) {
        let response: FormattedResponse | undefined;

        switch (gigsContentType) {
          case GigsContentType.Sent:
            response = await getClientOffers(loggedInUser?.accountId, status);
            break;
          case GigsContentType.Received:
            response = await getFreelancerOffers(
              loggedInUser?.accountId,
              status
            );
            break;
        }
        if (response && response.status === 'success') {
          return response.data;
        } else {
          toast({
            title: 'Unable to load offers',
            description: 'Contact support if issue persists',
          });
          throw new Error('Unable to load offers');
        }
      }
    },
    enabled: !!loggedInUser,
  });
};
