import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useToast } from '@/components/ui/use-toast';
import { ContractType } from '@/types';
import { useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
  setContract: (contract: ContractType | undefined) => void;
  isClient: boolean;
};

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab, setContract, isClient } = data;
  const { toast } = useToast();

  return useQuery({
    queryKey: ['contractForOffer'],
    queryFn: async () => {
      const response = await getContractForOffer(currentOfferId);

      if (response && response.status === 'success') {
        setContract(response.data);
      } else {
        toast({
          title: 'Unable to fetch contract information',
          description: 'If the problem persists, please contract support',
        });
      }
    },
    enabled: (isOpen && activeTab === ActiveTab.Contract) || !!isClient,
  });
};
