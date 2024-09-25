import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { createWidget, CreateWidgetParams } from '@/lib/service';

export const useCreateWidget = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: CreateWidgetParams) => {
      const response = await createWidget(params);
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
