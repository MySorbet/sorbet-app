import { useQuery } from '@tanstack/react-query';

import { getOfferById } from '@/api/gigs';
import { PrismaOfferType } from '@/types';

export const useGetOffer = (offerId: string) => {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: async (): Promise<PrismaOfferType> => {
      const res = await getOfferById(offerId);
      return res.data;
    },
  });
};
