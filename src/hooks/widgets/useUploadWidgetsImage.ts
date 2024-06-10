import { uploadWidgetsImageAsync } from '@/api/images';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUploadWidgetsImage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => await uploadWidgetsImageAsync(data),
    onError: (error) => {
      console.error('ERROR:', error);
      toast({ title: 'Error', description: 'Failed to upload widget image' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
