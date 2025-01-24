import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/types';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

/**
  Fetches contract data for a given offer, wrapping API call with react-query
  @params data - object containing currentOfferId, isOpen, and activeTab
  @returns data of ContractType or null
*/
export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;

  const query = useQuery({
    queryKey: ['contractForOffer', currentOfferId],
    queryFn: async () => {
      const response = await getContractForOffer(currentOfferId);

      if (response) {
        if (response.data === '') {
          return null;
        } else {
          return response.data;
        }
      } else {
        toast.error('Unable to fetch contract information', {
          description: 'If the problem persists, please contact support',
        });
        throw new Error('Unable to fetch contract information');
      }
    },
    // Query function will only run when the isOpen and activeTab are true and the activeTab is the Contract tab
    enabled: isOpen && activeTab === 'Contract',
  });

  return query;
};
