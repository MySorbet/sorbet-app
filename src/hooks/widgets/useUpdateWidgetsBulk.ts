import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateWidgetsBulk } from '@/api/widgets';
import { useToast } from '@/components/ui/use-toast';
import { UpdateWidgetsBulkDto } from '@/types';

export const useUpdateWidgetsBulk = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: UpdateWidgetsBulkDto[]) =>
      await updateWidgetsBulk(payload),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    onError: (error) =>
      toast({
        title: 'Failed to update widget',
        description: error.message + ' If the issue persists, contact support',
      }),
  });
};
