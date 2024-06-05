import { useToast } from '@/components/ui/use-toast';
import { deleteWidget } from '@/lib/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteWidget = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteWidget(id),
    onSettled: () =>
      // Double check what the query key should be when for the initial fetch
      queryClient.invalidateQueries({ queryKey: ['widgets'] }),
    onError: (error) =>
      toast({
        title: 'Failed to remove widget',
        description: 'If the issue persists, contact support',
      }),
  });
};
