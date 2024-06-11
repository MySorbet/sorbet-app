import { updateUser } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { User } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUser = (setIsSubmitting: (loading: boolean) => void) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userToUpdate: User) =>
      updateUser(userToUpdate, userToUpdate.id),
    onSuccess: (user: User) => {
      dispatch(updateUserData(user));
      toast({
        title: 'Profile updated',
        description: 'Your changes were saved successfully',
      });
    },
    onError: (error: any) => {
      alert(
        'Unable to save changes to your profile due to an issue at our end, please try again soon.'
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
};
