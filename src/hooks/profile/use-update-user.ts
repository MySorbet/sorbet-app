import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateUser } from '@/api/user';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types';

type UseUpdateUserOptions = {
  toastOnSuccess?: boolean;
  toastOnError?: boolean;
  onError?: (error: unknown) => void;
};

export const useUpdateUser = ({
  toastOnSuccess = true,
  toastOnError = true,
  onError,
}: UseUpdateUserOptions = {}) => {
  const { dangerouslySetUser } = useAuth();

  return useMutation({
    mutationFn: async (userToUpdate: Partial<User> & { id: string }) =>
      await updateUser(userToUpdate, userToUpdate.id),
    onSuccess: async (response) => {
      dangerouslySetUser(response.data);
      if (toastOnSuccess) {
        toast.success('Profile updated', {
          description: 'Your changes were saved successfully.',
        });
      }
    },
    onError: (error: unknown) => {
      if (onError) {
        onError(error);
        return;
      }

      if (!toastOnError) {
        return;
      }

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
