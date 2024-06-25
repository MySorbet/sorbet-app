import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;

  return useQuery({
    queryKey: ['contractForOffer'],
    queryFn: async () => await getContractForOffer(currentOfferId),
    enabled: isOpen && activeTab === ActiveTab.Contract,
  });
};
