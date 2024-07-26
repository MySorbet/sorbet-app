import { getContractForOffer } from '@/api/gigs';
import { ActiveTab } from '@/app/gigs/gigs-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';

type useGetContractForOfferParams = {
  currentOfferId: string;
  isOpen: boolean;
  activeTab: ActiveTab;
};

export const useGetContractForOffer = (data: useGetContractForOfferParams) => {
  const { currentOfferId, isOpen, activeTab } = data;

  const query = useQuery({
    queryKey: ['contractForOffer', currentOfferId],
    queryFn: async () => {
      const res = await getContractForOffer(currentOfferId);
      return res.data;
    },
    enabled: isOpen && activeTab === 0,
  });

  return query;
};
