import { uploadProfileImageAsync } from '@/api/images';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@/types';
import { useMutation } from '@tanstack/react-query';

type uploadProfileImageParams = {
  imageFormData: FormData;
  userToUpdate: User;
};

export const useUploadProfileImage = () => {
  const { toast } = useToast();

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
    onError: (error: any) => {
      toast({
        title: 'Profile Image not updated',
        description: 'Your profile image could not be saved due to an error.',
      });
    },
  });
};
