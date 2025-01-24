import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateOfferStatus } from '@/api/gigs';
import { OfferType } from '@/types';

interface updateOfferStatusParams {
  currentOffer: OfferType | undefined;
  status: string;
}

export const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: updateOfferStatusParams) => {
      const { currentOffer, status } = data;
      if (currentOffer) {
        if (confirm('Are you sure you want to update this offer?')) {
          await updateOfferStatus(currentOffer.id, status);
          toast.success('Offer rejected', {
            description: 'The offer was rejected successfully',
          });
        }
      } else {
        throw new Error('Offer not found');
      }
    },
    onError: (error) => {
      toast.error('Failed to update offer.', {
        description: error.message,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });
};
