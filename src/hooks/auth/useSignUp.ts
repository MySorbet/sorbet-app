import { signUp, type SignUpWithEmailTypes } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useSignUp = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpWithEmailTypes) => await signUp(data),
    onError: (error) =>
      toast({
        title: 'Unable to create user account',
        description: error.message,
        variant: 'destructive',
      }),
  });
};
