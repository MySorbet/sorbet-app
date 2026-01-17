import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuth, useUpdateUser } from '@/hooks';

import { profileSchema, type ProfileFormData } from '../schemas';

const HANDLE_CONFLICT_MESSAGE =
  'Your handle must be unique. This handle is already in use.';

export const useProfileForm = () => {
  const { user } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      city: user?.city ?? '',
      bio: user?.bio ?? '',
      handle: user?.handle ?? '',
      tags: user?.tags ?? [],
    },
    mode: 'onTouched',
  });

  const { isPending: isUpdating, mutateAsync: updateUserAsync } =
    useUpdateUser({
      toastOnError: false,
      onError: (error: unknown) => {
        const status = (error as { status?: number })?.status;
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update profile.';
        const normalizedMessage = errorMessage.toLowerCase();

        if (
          status === 409 ||
          normalizedMessage.includes('handle already in use') ||
          normalizedMessage.includes('handle must be unique')
        ) {
          form.setError('handle', {
            type: 'server',
            message: HANDLE_CONFLICT_MESSAGE,
          });
          return;
        }

        toast.error('Failed to update profile', {
          description: errorMessage,
        });
      },
    });

  const { isDirty, isValid } = form.formState;

  const onSubmit = async (formData: ProfileFormData) => {
    if (!user?.id) {
      toast.error('Unable to update profile details');
      return;
    }

    try {
      await updateUserAsync({
        ...formData,
        id: user.id,
      });
      form.reset(formData); // Reset dirty state
    } catch (error) {
      // Error feedback handled in the mutation's onError callback.
      console.error('Failed to update profile', error);
    }
  };

  const handleCancel = () => {
    form.reset();
  };

  return {
    form,
    onSubmit,
    handleCancel,
    isDirty,
    isValid,
    isUpdating,
  };
};
