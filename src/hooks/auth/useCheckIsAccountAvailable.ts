import { checkIsAccountAvailable } from '../../api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useCheckIsAccountAvailable = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (username: string) =>
      await checkIsAccountAvailable(username),
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
      });
      console.error(error);
    },
  });
};
