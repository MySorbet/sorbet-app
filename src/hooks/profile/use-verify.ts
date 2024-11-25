import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { verifyUser } from '@/api/bridge';

export const useVerify = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: verifyUser,
    ...options,
  });
};
