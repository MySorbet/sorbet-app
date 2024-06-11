import { deleteProfileImageAsync } from '@/api/user';
import { useMutation } from '@tanstack/react-query';

export const useDeleteProfileImage = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteProfileImageAsync(userId);
    },
  });
};
