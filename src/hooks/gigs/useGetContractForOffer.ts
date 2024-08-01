import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-dialog';
import { useToast } from '@/components/ui/use-toast';
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
      console.log('getContractOffer');
      const response = await getContractForOffer(currentOfferId);

      if (response && response.data) {
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

  return query;
};
