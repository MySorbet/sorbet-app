import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useLoginWithEmail = () => {
  const { loginWithEmail } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await loginWithEmail(email);
      if (response.status === 'success') {
        return { status: 'success', message: response.message };
      } else {
        throw new Error('Failed to login with email');
      }
    },
    onError: (error: any) => {
      toast({ title: 'Authentication error', description: error.message });
    },
  });
};
