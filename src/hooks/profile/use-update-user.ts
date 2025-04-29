import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateUser } from '@/api/user';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types';

export const useUpdateUser = (
  options: {
    toastOnSuccess?: boolean;
  } = { toastOnSuccess: true }
) => {
  const { dangerouslySetUser } = useAuth();

  return useMutation({
    mutationFn: async (userToUpdate: Partial<User> & { id: string }) =>
      await updateUser(userToUpdate, userToUpdate.id),
    onSuccess: async (response) => {
      dangerouslySetUser(response.data);
      if (options.toastOnSuccess) {
        toast.success('Profile updated', {
          description: 'Your changes were saved successfully.',
        });
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast.error('User profile failed to update.', {
        description: errorMessage + ' If the issue persists, contact support.',
      });
    },
    onSettled: () => {
      // Request complete.
    },
  });
};
