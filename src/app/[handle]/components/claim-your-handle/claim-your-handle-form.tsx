import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { Form, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth, useUpdateUser } from '@/hooks';

import { HandleInput, validateHandle } from './handle-input';

const HANDLE_CONFLICT_MESSAGE =
  'Your handle must be unique. This handle is already in use.';

export const ClaimYourHandleForm = () => {
  const { user } = useAuth();
  const schema = z.object({
    handle: validateHandle(user?.handle ?? ''),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      handle: user?.handle ?? '',
    },
  });

  const { isSubmitting, isValid } = useFormState(form);

  const { mutateAsync: updateUser } = useUpdateUser({
    toastOnSuccess: false,
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
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!user) throw new Error('User not found');
    try {
      await updateUser({
        id: user.id,
        handle: data.handle, // this could be the same as the existing handle but that's fine
        hasClaimedHandle: true,
      });
    } catch (error) {
      console.error('Failed to claim handle', error);
      return;
    }
    // Force a full page refresh to get the latest user state (if we use RQ for user, we could just next router replace here)
    window.location.replace(`/${data.handle}`);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex min-w-60 max-w-80 flex-col gap-6'
      >
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold'>Claim Your Handle</h1>
          <p className='text-muted-foreground'>
            Edit your unique Sorbet handle to easily share on your socials and
            connect with others!
          </p>
        </div>
        <FormField
          control={form.control}
          name='handle'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HandleInput
                  aria-label='Handle'
                  name={field.name}
                  register={form.register}
                  setValue={form.setValue}
                  error={form.formState.errors.handle}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          variant='sorbet'
          className='w-fit'
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting && <Spinner className='mr-1' />}
          {isSubmitting ? 'Saving...' : 'Save & continue'}
        </Button>
      </form>
    </Form>
  );
};
