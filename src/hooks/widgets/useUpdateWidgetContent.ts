import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateWidgetContent } from '@/api/widgets';
import { WidgetContentType } from '@/types';

export const useUpdateWidgetContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      content,
    }: {
      key: string;
      content: WidgetContentType;
    }) => await updateWidgetContent(key, content),
    onError: () =>
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
