import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateWidgetLink } from '@/api/widgets';

export const useUpdateWidgetLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, url }: { key: string; url: string }) =>
      await updateWidgetLink(key, url),
    onError: () =>
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
