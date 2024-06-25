import { useAuth } from '../useAuth';
import {
  getClientOffers,
  getClilentOffers2,
  getFreelancerOffers,
  getFreelancerOffers2,
} from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { GigsContentType, User } from '@/types';
import { FormattedResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useFetchOffers = (
  loggedInUser: User | null,
  gigsContentType: GigsContentType
) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      if (loggedInUser?.accountId) {
        let response: FormattedResponse | undefined;

        switch (gigsContentType) {
          case GigsContentType.Sent:
            response = await getClientOffers(
              loggedInUser?.accountId,
              'Pending'
            );
            break;
          case GigsContentType.Received:
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

export const useFetchOffers2 = (
  loggedInUser: User | null,
  gigsContentType: GigsContentType
) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      if (loggedInUser?.accountId) {
        let response: any;
        try {
          switch (gigsContentType) {
            case GigsContentType.Sent:
              response = await getClilentOffers2(
                loggedInUser?.accountId,
                'Pending'
              );
              break;
            case GigsContentType.Received:
              response = await getFreelancerOffers2(
                loggedInUser?.accountId,
                'Pending'
              );
              break;
          }
        } catch (error: any) {
          toast({
            title: 'Unable to load offers',
            description: 'Contact support if issue persists',
          });
          throw new Error(error.message);
        }

        if (response && response.status === 'success') {
          return response.data;
        } else {
          throw new Error();
        }
      }
    },
    enabled: !!loggedInUser,
  });
};
