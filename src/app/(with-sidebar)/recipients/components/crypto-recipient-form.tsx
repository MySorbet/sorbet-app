'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import { useForm, useFormContext, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { BaseAlert } from '@/components/common/base-alert';
import { Spinner } from '@/components/common/spinner';
import BaseInProduct from '~/svg/base-in-product.svg';
import StellarLogo from '~/svg/stellar_logo.svg';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMyChain } from '@/hooks/use-my-chain';
import { cn } from '@/lib/utils';

const isEvmAddress = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s.trim());
const isStellarAddress = (s: string) => /^G[A-Z2-7]{55}$/.test(s.trim());

const formSchema = z
  .object({
    chain: z.enum(['base', 'stellar']),
    /** A name to remember this wallet by */
    label: z.string().min(1, 'Label is required'),
    /** The wallet address that will receive the funds */
    walletAddress: z.string().min(1, 'Wallet address is required'),
  })
  .superRefine(({ chain, walletAddress }, ctx) => {
    if (chain === 'base' && !isEvmAddress(walletAddress)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must be a valid Base (EVM) address',
        path: ['walletAddress'],
      });
    }
    if (chain === 'stellar' && !isStellarAddress(walletAddress)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must be a valid Stellar public key (G...)',
        path: ['walletAddress'],
      });
    }
  });

export type CryptoRecipientFormValues = z.infer<typeof formSchema>;

export const cryptoFormId = 'crypto-recipient-form';

export const CryptoRecipientFormContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: myChainData } = useMyChain();
  const form = useForm<CryptoRecipientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chain: 'base',
      label: '',
      walletAddress: '',
    },
    mode: 'onChange',
  });

  // Default Network dropdown to user's current chain (once loaded),
  // but don't override if the user has already changed the field.
  useEffect(() => {
    const next = myChainData?.chain;
    if (!next) return;
    const dirty = (form.formState.dirtyFields as any)?.chain;
    if (!dirty) form.setValue('chain', next, { shouldValidate: true });
  }, [myChainData?.chain, form]);

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
  const chain = form.watch('chain');
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);

  const networkMeta =
    chain === 'stellar'
      ? { label: 'Stellar', logoSrc: '/svg/stellar_logo.svg', alt: 'Stellar' }
      : { label: 'Base', logoSrc: '/svg/base_logo.svg', alt: 'Base' };

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
        title={`Is this a ${networkMeta.label} network address?`}
        description={`Make sure this address can accept USDC on ${networkMeta.label}. If not, you could lose your funds.`}
        icon={
          chain === 'stellar' ? (
            <StellarLogo className='size-5' />
          ) : (
            <BaseInProduct className='size-5' />
          )
        }
      />

      <FormField
        control={form.control}
        name='chain'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Network</FormLabel>
            <FormControl>
              <DropdownMenu open={isNetworkOpen} onOpenChange={setIsNetworkOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-10 w-full justify-between px-3 font-normal'
                    aria-label='Select a network'
                  >
                    <div className='flex items-center gap-2'>
                      <Image
                        src={networkMeta.logoSrc}
                        alt={networkMeta.alt}
                        width={16}
                        height={16}
                      />
                      <span>{networkMeta.label}</span>
                    </div>
                    {isNetworkOpen ? (
                      <ChevronUp className='size-4 text-muted-foreground' />
                    ) : (
                      <ChevronDown className='size-4 text-muted-foreground' />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-[--radix-dropdown-menu-trigger-width]'>
                  <DropdownMenuRadioGroup
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as 'base' | 'stellar')}
                  >
                    <DropdownMenuRadioItem value='base'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src='/svg/base_logo.svg'
                          alt='Base'
                          width={16}
                          height={16}
                        />
                        <span>Base</span>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='stellar'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src='/svg/stellar_logo.svg'
                          alt='Stellar'
                          width={16}
                          height={16}
                        />
                        <span>Stellar</span>
                      </div>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
              <Input
                placeholder={chain === 'stellar' ? 'G...' : '0x...'}
                {...field}
                className='text-ellipsis'
              />
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
      className={cn('w-fit', className)}
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
CryptoRecipientSubmitButton.displayName = 'CryptoRecipientSubmitButton';
