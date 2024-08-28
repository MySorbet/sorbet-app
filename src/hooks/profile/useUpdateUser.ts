import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { updateUser } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { User, UserWithId } from '@/types';

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userToUpdate: UserWithId): Promise<any> =>
      await updateUser(userToUpdate, userToUpdate.id),
    onSuccess: (user: AxiosResponse) => {
      dispatch(updateUserData(user.data));
      toast({
        title: 'Profile updated',
        description: 'Your changes were saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'User profile failed to update.',
        description: error.message + ' If the issue persists, contact support.',
      });
    },
    onSettled: () => {
      // Request complete.
    },
  });
};
