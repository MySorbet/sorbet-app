import { updateOfferStatus } from '@/api/gigs';
import { useToast } from '@/components/ui/use-toast';
import { OfferType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface updateOfferStatusParams {
  currentOffer: OfferType | undefined;
  status: string;
}

export const useUpdateOfferStatus = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: updateOfferStatusParams) => {
      const { currentOffer, status } = data;
      if (currentOffer) {
        if (confirm('Are you sure you want to update this offer?')) {
          const response = await updateOfferStatus(currentOffer.id, status);
          if (response.status == 'success') {
            toast({
              title: 'Offer rejected',
              description: 'The offer was rejected successfully',
            });
          } else {
            throw new Error('Failed to reject offer');
          }
        }
      } else {
        throw new Error('Offer not found');
      }
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update offer.', description: error.message });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });
};
