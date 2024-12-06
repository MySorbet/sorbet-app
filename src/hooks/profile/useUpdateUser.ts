import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

import { updateUser } from '@/api/user';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { UserWithId } from '@/types';

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (userToUpdate: UserWithId): Promise<any> =>
      await updateUser(userToUpdate, userToUpdate.id),
    onSuccess: (user: AxiosResponse) => {
      dispatch(updateUserData(user.data));
      toast('Profile updated', {
        description: 'Your changes were saved successfully.',
      });
    },
    onError: (error: any) => {
      toast('User profile failed to update.', {
        description: error.message + ' If the issue persists, contact support.',
      });
    },
    onSettled: () => {
      // Request complete.
    },
  });
};
