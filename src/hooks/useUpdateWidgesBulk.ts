import { updateWidgetsBulk } from '@/lib/service';
import { UpdateWidgetsBulkDto } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateWidgetsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWidgetsBulkDto[]) => updateWidgetsBulk(payload),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
