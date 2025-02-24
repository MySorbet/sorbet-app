import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth, useUpdateUser } from '@/hooks';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export type SettingsFormSchema = z.infer<typeof formSchema>;

export const useSettingsForm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isPending: updateProfilePending, mutateAsync: updateProfileAsync } = useUpdateUser();

  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
    mode: 'onTouched',
  });

  const { isDirty, isValid } = form.formState;

  const onSubmit = async (formData: SettingsFormSchema) => {
    if (!user?.id) {
      alert('Unable to update profile details right now.');
      return;
    }

    const userToUpdate = {
      ...formData,
      id: user.id
    };

    await updateProfileAsync(userToUpdate);
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return {
    form,
    onSubmit,
    isDirty,
    isValid,
    updateProfilePending
  };
}; 