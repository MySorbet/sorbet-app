import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useMutation, useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;

  return useQuery({
    queryKey: ['contractForOffer', currentOfferId],
    queryFn: async () => {
      console.log('getContractOffer');
      const response = await getContractForOffer(currentOfferId);

      if (response && response.status === 'success') {
        return response.data;
      } else {
        toast({
          title: 'Unable to fetch contract information',
          description: 'If the problem persists, please contract support',
        });
        throw new Error('Unable to fetch contract information');
      }
    },
    enabled: isOpen && activeTab === 0,
  });
};
