import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { uploadWidgetsImageAsync } from '@/api/images';

export const useUploadWidgetsImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => await uploadWidgetsImageAsync(data),
    onError: (error) => {
      toast('Failed to upload widget image', {
        description: error.message,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
