'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef } from 'react';
import { useForm, useFormContext, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { BaseAlert } from '@/components/common/base-alert';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  /** A name to remember this wallet by */
  label: z.string().min(1, 'Label is required'),
  /** The wallet address that will receive the funds */
  walletAddress: z
    .string()
    .min(1, 'Wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address'),
});

export type CryptoRecipientFormValues = z.infer<typeof formSchema>;

export const cryptoFormId = 'crypto-recipient-form';

export const CryptoRecipientFormContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<CryptoRecipientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      walletAddress: '',
    },
    mode: 'onChange',
  });

  return <Form {...form}>{children}</Form>;
};

const useCryptoRecipientForm = () =>
  useFormContext<CryptoRecipientFormValues>();

export const CryptoRecipientForm = ({
  className,
  onSubmit,
}: {
  className?: string;
  onSubmit?: (values: CryptoRecipientFormValues) => Promise<void>;
}) => {
  const form = useCryptoRecipientForm();

  const handleSubmit = async (values: CryptoRecipientFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      // TODO: p-1 prevents focus rings from clipping. Find a better solution that doesn't throw off alignment
      className={cn('flex flex-col gap-3 p-1', className)}
      id={cryptoFormId}
    >
      <BaseAlert
        title='Is this a Base network address?'
        description='Make sure this address can accept USDC on Base. If not, you could lose your funds.'
      />

      <FormField
        control={form.control}
        name='label'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input placeholder='Who does this belong to?' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='walletAddress'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wallet address</FormLabel>
            <FormControl>
              <Input placeholder='0x...' {...field} className='text-ellipsis' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};

export const CryptoRecipientSubmitButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const form = useCryptoRecipientForm();
  const { isValid, isSubmitting } = useFormState({ control: form.control });

  return (
    <Button
      ref={ref}
      variant='sorbet'
      type='submit'
      form={cryptoFormId}
      disabled={!isValid || isSubmitting}
      className={cn(className, 'w-fit')}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Spinner /> Saving...
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
});
