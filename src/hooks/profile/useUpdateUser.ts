import { updateUser } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { User } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userToUpdate: User) => {
      const response = await updateUser(userToUpdate, userToUpdate.id);
      console.log(response);
      if (response.status == 'failed') {
        throw new Error('Failed to update user profile.');
      }
      return response;
    },
    onSuccess: (user: User) => {
      dispatch(updateUserData(user));
      toast({
        title: 'Profile updated',
        description: 'Your changes were saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'User profile failed to update.',
        description:
          'Your profile could not be saved. If the issue persists, please contact support.',
      });
    },
    onSettled: () => {
      // Request complete.
    },
  });
};
