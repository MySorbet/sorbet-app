import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientAPI } from '@/api/recipients/types';

/** RQ wrapper for DELETE /recipients/:id */
export const useDeleteRecipient = (
  options?: UseMutationOptions<RecipientAPI, Error, string, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: string) => recipientsApi.delete(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
    },
    onError: (error) => {
      toast.error("We couldn't delete that recipient", {
        description: extractErrorMessage(error),
      });
    },
    ...options,
  });
};

/**
 * Extract a user-friendly error message from either an Axios error or a regular Error
 * TODO: Consider sharing this with the rest of the app
 * @param error The error to extract the message from
 * @returns A string message suitable for displaying to users
 */
export const extractErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data.message ?? error.message;
  }
  return error instanceof Error ? error.message : String(error);
};
