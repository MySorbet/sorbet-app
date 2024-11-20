import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { restoreWidgetImage } from '@/api/widgets';
import { WidgetContentType, WidgetType } from '@/types';

export const useRestoreWidgetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      type,
      redirectUrl,
      content,
    }: {
      key: string;
      type: WidgetType;
      redirectUrl: string;
      content: WidgetContentType;
    }) => await restoreWidgetImage(key, type, redirectUrl, content),
    onError: () =>
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
