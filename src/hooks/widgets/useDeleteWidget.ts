import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteWidget } from '@/api/widgets';

export const useDeleteWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await deleteWidget(id),
    onError: () =>
      toast('Failed to remove widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () =>
      // Double check what the query key should be when for the initial fetch
      queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
