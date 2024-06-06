import { useToast } from '@/components/ui/use-toast';
import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useGetWidgetContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, type }: { url: string; type: WidgetType }) =>
      getWidgetContent({ url, type }),
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to fetch widget content' });
    },
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
