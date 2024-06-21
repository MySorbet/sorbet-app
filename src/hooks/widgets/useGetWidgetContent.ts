import { useToast } from '@/components/ui/use-toast';
import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type GetWidgetContentParams = {
  url: string;
  type: WidgetType;
};

export const useGetWidgetContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GetWidgetContentParams) => {
      console.log('get widget content data: ', data);
      const res = await getWidgetContent({ url: data.url, type: data.type });
      console.log('get widget content result: ', res);
      return res;
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to fetch widget content' });
    },
    // No need to invalidate query since we are not mutating data here
    // Can use onSettled callback to do something
  });
};
