import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { getWidgetContent, GetWidgetContentParams } from '@/lib/service';

export const useGetWidgetContent = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: GetWidgetContentParams) => {
      const response = await getWidgetContent(params);
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
