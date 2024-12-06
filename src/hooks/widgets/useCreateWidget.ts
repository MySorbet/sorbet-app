import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createWidget, CreateWidgetParams } from '@/api/widgets';

export const useCreateWidget = () => {
  return useMutation({
    mutationFn: async (params: CreateWidgetParams) => {
      const response = await createWidget(params);
      if (response) {
        return response.data;
      }
    },
    onError: (error) => {
      toast('Something went wrong', { description: error.message });
    },
    // No need to invalidate query since we are not mutating data here
    // Can use onSettled callback to do something
  });
};
