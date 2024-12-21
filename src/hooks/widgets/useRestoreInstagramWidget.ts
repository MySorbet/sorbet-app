import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { restoreInstagramWidget } from '@/api/widgets';
export const useRestoreInstagramWidget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      redirectUrl,
    }: {
      key: string;
      redirectUrl: string;
    }) => await restoreInstagramWidget(key, redirectUrl),
    onError: () =>
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
