import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteProfileImageAsync } from '@/api/user';

export const useDeleteProfileImage = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteProfileImageAsync(userId);
    },
    onError: () => {
      toast.error('Profile image not deleted', {
        description: 'Your profile image could not be deleted due to an error',
      });
    },
  });
};
