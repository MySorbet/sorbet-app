import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteWidget } from '@/api/widgets';
import { useToast } from '@/components/ui/use-toast';

export const useDeleteWidget = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => await deleteWidget(id),
    onError: (error) =>
      toast({
        title: 'Failed to remove widget',
        description: 'If the issue persists, contact support',
      }),
    onSettled: () =>
      // Double check what the query key should be when for the initial fetch
      queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
