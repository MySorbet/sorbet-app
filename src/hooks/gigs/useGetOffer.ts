import { getOfferById } from '@/api/gigs';
import { ContractType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetOffer = (
  offerId: string,
  contractData: ContractType | undefined
) => {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: async () => {
      const res = await getOfferById(offerId);
      return res.data;
    },
    enabled: !contractData && offerId.length > 0,
  });
};
