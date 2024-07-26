import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useMutation, useQuery } from '@tanstack/react-query';

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

  return useQuery({
    queryKey: ['contractForOffer', currentOfferId],
    queryFn: async () => {
      const res = await getContractForOffer(currentOfferId);
      return res.data;
    },
    enabled: isOpen && activeTab === 0,
  });
};
