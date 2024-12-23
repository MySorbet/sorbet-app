import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { restoreWidgetImage } from '@/api/widgets';
import { WidgetType } from '@/types';

export const useRestoreWidgetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      type,
      redirectUrl,
    }: {
      key: string;
      type: WidgetType;
      redirectUrl: string;
    }) => await restoreWidgetImage(key, type, redirectUrl),
    onError: () =>
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
