import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAuth, useUpdateUser } from '@/hooks';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export type SettingsFormSchema = z.infer<typeof formSchema>;

export const useSettingsForm = () => {
  const { user } = useAuth();
  const { isPending: updateProfilePending, mutateAsync: updateProfileAsync } =
    useUpdateUser();

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
      toast.error('Unable to update profile details');
      return;
    }

    const userToUpdate = {
      ...formData,
      id: user.id,
    };

    await updateProfileAsync(userToUpdate);
  };

  return {
    form,
    onSubmit,
    isDirty,
    isValid,
    updateProfilePending,
  };
};
