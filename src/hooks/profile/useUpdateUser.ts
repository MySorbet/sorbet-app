import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

import { updateUser } from '@/api/user';
import { useUser } from '@/hooks/use-auth';
import { UserWithId } from '@/types';

export const useUpdateUser = (
  options: {
    toastOnSuccess?: boolean;
  } = { toastOnSuccess: true }
) => {
  const [, setUser] = useUser();

  return useMutation({
    mutationFn: async (userToUpdate: UserWithId) =>
      await updateUser(userToUpdate, userToUpdate.id),
    onSuccess: (user: AxiosResponse) => {
      setUser(user.data);
      if (options.toastOnSuccess) {
        toast('Profile updated', {
          description: 'Your changes were saved successfully.',
        });
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast('User profile failed to update.', {
        description: errorMessage + ' If the issue persists, contact support.',
      });
    },
    onSettled: () => {
      // Request complete.
    },
  });
};
