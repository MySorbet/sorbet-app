import { useToast } from '@/components/ui/use-toast';
import { updateWidgetsBulk } from '@/lib/service';
import { UpdateWidgetsBulkDto } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateWidgetsBulk = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateWidgetsBulkDto[]) => updateWidgetsBulk(payload),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    onError: (error) =>
      toast({
        title: 'Failed to update widget',
        description: 'If the issue persists, contact support',
      }),
  });
};
