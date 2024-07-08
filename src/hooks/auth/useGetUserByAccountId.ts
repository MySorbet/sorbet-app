import { getUserByAccountId } from '@/api/user';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const useGetUserByAccountId = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (accountId: string) =>
      await getUserByAccountId(accountId),
    onError: async () => {
      toast({
        title: 'No account found',
        description:
          'No account found for the connected wallet, please signup first',
        variant: 'destructive',
      });
      return { data: 'failed' };
    },
  });
};

export { useGetUserByAccountId };
