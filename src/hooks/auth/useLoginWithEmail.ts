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
        return response;
      } else {
        throw new Error(response.message || 'Failed to login with email');
      }
    },
    onError: (error: any) => {
      toast({ title: 'Authentication error', description: error.message });
    },
  });
};

export const useLoginWithEmail2 = () => {
  const { loginWithEmail } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => await loginWithEmail(email),
    onError: (error: any) => {
      toast({ title: 'Authentication error', description: error.message });
    },
  });
};
