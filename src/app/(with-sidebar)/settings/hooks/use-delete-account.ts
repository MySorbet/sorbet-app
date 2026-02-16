import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

import { env } from '@/lib/env';
import { withAuthHeader } from '@/api/with-auth-header';
import { getApiErrorMessage } from '@/api/error-message';
import { useAuth } from '@/hooks';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const useDeleteAccount = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Delete account directly (user confirms by typing "DELETE")
  const deleteAccount = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      const response = await axios.delete(
        `${API_URL}/users/${user.id}`,
        await withAuthHeader()
      );
      return response.data;
    },
    onSuccess: async () => {
      toast.success('Account deleted successfully');
      await logout();
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error) || 'Failed to delete account');
      console.error('Delete account error:', error);
    },
  });

  return {
    deleteAccount: deleteAccount.mutate,
    isDeleting: deleteAccount.isPending,
  };
};

