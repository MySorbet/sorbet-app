import { signUpAsync } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { SignUpWithEmailTypes } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useSignUpAsync = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpWithEmailTypes) => await signUpAsync(data),
    onError: (error) =>
      toast({
        title: 'Error',
        description: error.message,
      }),
  });
};
