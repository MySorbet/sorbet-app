import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { WidgetLayoutItem } from '@/types';
import { updateWidgetContent } from '@/api/widgets';

export const useUpdateWidgetContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (widgetLayoutItem: WidgetLayoutItem) =>
      await updateWidgetContent(widgetLayoutItem),
    onError: () =>
      toast({
        title: 'Failed to update widget',
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
