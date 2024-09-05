import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';

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
      toast({ title: 'Something went wrong', description: error.message });
    },
    // No need to invalidate query since we are not mutating data here
    // Can use onSettled callback to do something
  });
};
