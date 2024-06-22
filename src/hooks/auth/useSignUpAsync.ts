import { signUpAsync, signUpAsync2 } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { SignUpWithEmailTypes } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useSignUpAsync = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpWithEmailTypes) => {
      const response = await signUpAsync(data);
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      toast({
        title: 'Unable to create user account',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {},
  });
};

export const useSignupAsync2 = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpWithEmailTypes) => await signUpAsync2(data),
    onError: (error) =>
      toast({
        title: 'Unable to create user account',
        description: error.message,
        variant: 'destructive',
      }),
  });
};
