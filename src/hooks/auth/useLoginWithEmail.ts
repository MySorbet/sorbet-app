import { useAuth } from '../useAuth';
import { useMutation } from '@tanstack/react-query';

export const useLoginWithEmail = () => {
  const { loginWithEmail } = useAuth();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await loginWithEmail(email);
      if (response.status === 'success') {
        return 'success';
      } else {
        return 'failed';
      }
    },
  });
};
