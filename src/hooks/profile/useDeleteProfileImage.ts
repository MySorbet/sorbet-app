import { deleteProfileImageAsync } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteProfileImage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await deleteProfileImageAsync(userId);
      if (response.status == 'failed') {
        throw new Error('Profile Image not deleted');
      }

      return response;
    },
    onError: (error: any) => {
      toast({
        title: 'Profile Image not deleted',
        description: 'Your profile image could not be deleted due to an error.',
      });
    },
  });
};
