import { uploadWidgetsImageAsync } from '@/api/images';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useUploadWidgetsImage = () => {
  const { toast } = useToast();
  // Don't want to invalidate here because currently, we are manually updating state and data through updateWidgetsBulk

  return useMutation({
    mutationFn: (data: FormData) => uploadWidgetsImageAsync(data),
    onError: () =>
      toast({ title: 'Error', description: 'Failed to upload widget image' }),
  });
};
