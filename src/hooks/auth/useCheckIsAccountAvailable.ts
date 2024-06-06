import { checkIsAccountAvailable } from '../../api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useCheckIsAccountAvailable2 = (username: string) => {
  return useQuery({
    queryKey: ['account-available', username],
    queryFn: async () => await checkIsAccountAvailable(username),
    enabled: username.length > 0,
  });
};
