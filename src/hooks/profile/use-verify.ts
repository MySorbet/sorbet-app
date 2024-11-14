import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { verifyUser } from '@/api/user';

export const useVerify = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: verifyUser,
    ...options,
  });
};
