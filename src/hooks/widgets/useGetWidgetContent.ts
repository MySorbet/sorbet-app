import { useToast } from '@/components/ui/use-toast';
import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';
import { useMutation } from '@tanstack/react-query';

type GetWidgetContentParams = {
  url: string;
  type: WidgetType;
};

export const useGetWidgetContent = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GetWidgetContentParams) => {
      const response = await getWidgetContent({
        url: data.url,
        type: data.type,
      });
      if (response) {
        return response.data;
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to fetch widget content' });
    },
    // No need to invalidate query since we are not mutating data here
    // Can use onSettled callback to do something
  });
};
