import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateWidgetsBulk } from '@/api/widgets';
import { UpdateWidgetsBulkDto } from '@/types';

export const useUpdateWidgetsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateWidgetsBulkDto[]) =>
      await updateWidgetsBulk(payload),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    onError: (error) =>
      toast('Failed to update widget', {
        description: error.message + ' If the issue persists, contact support',
      }),
  });
};
