import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { uploadProfileImageAsync } from '@/api/images';
import type { UserWithId } from '@/types';

type uploadProfileImageParams = {
  imageFormData: FormData;
  userToUpdate: UserWithId;
};

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: async (data: uploadProfileImageParams) => {
      const { imageFormData, userToUpdate } = data;

      const response = await uploadProfileImageAsync(imageFormData);
      if (response.data && response.data.fileUrl) {
        userToUpdate.profileImage = response.data.fileUrl;
      } else {
        throw new Error('Profile Image not updated');
      }
    },
    onError: (error) => {
      toast.error('Profile Image not updated', {
        description: `Your profile image could not be saved due to an error: ${error}`,
      });
    },
  });
};
