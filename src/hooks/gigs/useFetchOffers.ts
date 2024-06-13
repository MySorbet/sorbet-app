import { useAuth } from '../useAuth';
import { getClientOffers, getFreelancerOffers } from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { FormattedResponse } from '@/types';
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useFetchOffers = (loggedInUser: User | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      console.log('useFetchOffers fired');
      if (loggedInUser?.accountId) {
        let response: FormattedResponse | undefined;

        switch (loggedInUser?.userType) {
          case 'CLIENT':
            response = await getClientOffers(
              loggedInUser?.accountId,
              'Pending'
            );
            break;
          case 'FREELANCER':
            response = await getFreelancerOffers(
              loggedInUser?.accountId,
              'Pending'
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
