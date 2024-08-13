import { getContractForOffer } from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { ActiveTab } from '@/types';
import { useQuery } from '@tanstack/react-query';

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
  const { toast } = useToast();

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
        toast({
          title: 'Unable to fetch contract information',
          description: 'If the problem persists, please contract support',
        });
        throw new Error('Unable to fetch contract information');
      }
    },
    // Query function will only run when the isOpen and activeTab are true and the activeTab is the Contract tab
    enabled: isOpen && activeTab === 'Contract',
  });

  return query;
};
