import { deleteProfileImageAsync } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useDeleteProfileImage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await deleteProfileImageAsync(userId);
    },
    onError: (error: any) => {
      toast({
        title: 'Profile image not deleted',
        description: 'Your profile image could not be deleted due to an error',
      });
    },
  });
};
