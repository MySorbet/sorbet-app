import { checkIsAccountAvailable } from '../../api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useCheckIsAccountAvailable = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (username: string) => {
      const response = await checkIsAccountAvailable(username);
      return response || false;
    },
    onError: (error) => {
      toast({
        title: 'Error checking username availability',
        description: error.message,
      });
      console.error(error);
    },
  });
};
