import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateWidgetImage } from '@/api/widgets';
import { useToast } from '@/components/ui/use-toast';
import { WidgetLayoutItem } from '@/types';

export const useUpdateWidgetImage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (widgetLayoutItem: WidgetLayoutItem) =>
      await updateWidgetImage(widgetLayoutItem),
    onError: (error) =>
      toast({
        title: 'Failed to update widget',
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
