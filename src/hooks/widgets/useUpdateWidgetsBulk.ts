import { useToast } from '@/components/ui/use-toast';
import { updateWidgetsBulk } from '@/lib/service';
import { UpdateWidgetsBulkDto } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateWidgetsBulkParams = {
  payload: UpdateWidgetsBulkDto[];
  userId: string;
};

export const useUpdateWidgetsBulk = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateWidgetsBulkParams) =>
      await updateWidgetsBulk(data.payload),
    onMutate: async (data: UpdateWidgetsBulkParams) => {
      await queryClient.cancelQueries({ queryKey: ['widgets', data.userId] });
      const previousWidgets = queryClient.getQueryData([
        'widgets',
        data.userId,
      ]);

      queryClient.setQueryData(['widgets', data.userId], data.payload);

      return { previousWidgets, userId: data.userId };
    },
    onError: (error, newWidgets, context) => {
      queryClient.setQueryData(
        ['widgets', context?.userId],
        context?.previousWidgets
      );
      toast({
        title: 'Failed to update widget',
        description: 'If the issue persists, contact support',
      });
    },
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
