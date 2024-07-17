import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useRegisterWithEmail = () => {
  const { registerWithEmail } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await registerWithEmail(email);
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
