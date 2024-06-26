import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useLoginWithEmail = () => {
  const { loginWithEmail } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => await loginWithEmail(email), // Make sure to update loginWithEmail in useAuth
    onError: (error: any) => {
      toast({ title: 'Authentication error', description: error.message });
    },
  });
};
