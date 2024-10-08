import { useMutation } from '@tanstack/react-query';

import { createWidget, CreateWidgetParams } from '@/api/widgets';
import { useToast } from '@/components/ui/use-toast';

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
