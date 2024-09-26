import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadWidgetsImageAsync } from '@/api/images';
import { useToast } from '@/components/ui/use-toast';

export const useUploadWidgetsImage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => await uploadWidgetsImageAsync(data),
    onError: (error) => {
      toast({
        title: 'Failed to upload widget image',
        description: error.message,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
