import { uploadWidgetsImageAsync } from '@/api/images';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUploadWidgetsImage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      console.log('widget form data: ', data);
      const res = await uploadWidgetsImageAsync(data);
      console.log('res: ', res);
      return res;
    },
    onError: (error) => {
      console.error('ERROR:', error);
      toast({ title: 'Error', description: 'Failed to upload widget image' });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['widgets'] }),
  });
};
