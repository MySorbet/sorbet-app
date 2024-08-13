import { getOfferById } from '@/api/gigs';
import { ContractType, PrismaOfferType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetOffer = (offerId: string) => {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: async (): Promise<PrismaOfferType> => {
      const res = await getOfferById(offerId);
      return res.data;
    },
  });
};
