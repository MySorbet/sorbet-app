import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;
  const { toast } = useToast();

  return useQuery({
    queryKey: ['contractForOffer'],
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
    // Query function will only run whenm the isOpen and activeTab are true and the activeTab is the Contract tab
    enabled: isOpen && activeTab === ActiveTab.Contract,
  });
};
