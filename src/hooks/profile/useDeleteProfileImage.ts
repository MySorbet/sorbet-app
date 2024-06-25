import { deleteProfileImageAsync, deleteProfileImageAsync2 } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteProfileImage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await deleteProfileImageAsync(userId);
      if (response.status == 'success') {
        return response;
      } else {
        throw new Error('Profile Image not deleted');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Profile Image not deleted',
        description: 'Your profile image could not be deleted due to an error.',
      });
    },
  });
};

export const useDeleteProfileImage2 = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteProfileImageAsync2(userId);
    },
    onError: (error: any) => {
      toast({
        title: 'Profile image not deleted',
        description: 'Your profile image could not be deleted due to an error',
      });
    },
  });
};
