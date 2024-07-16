import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-comms';
import { useMutation, useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

interface Props {
  currentOfferId: string;
}

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;

  return useQuery({
    queryKey: ['contractForOffer', currentOfferId],
    queryFn: async () => {
      const res = await getContractForOffer(currentOfferId);
      return res.data;
    },
    // Query function will only run when the isOpen and activeTab are true and the activeTab is the Contract tab
    enabled: isOpen && activeTab === 0,
  });
};
