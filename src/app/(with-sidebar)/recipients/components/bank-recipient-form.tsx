'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import * as z from 'zod';

import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import {
  addressDefaultValues,
  AddressFormFields,
  addressSchema,
} from './address-form';
import { removeEmptyStrings } from './utils';

const usAccountSchema = z.object({
  account_number: z.string().min(1, 'Account number is required'),
  routing_number: z
    .string()
    .length(9, 'Routing number must be exactly 9 characters'),
  checking_or_savings: z.string().optional().default('checking'),
});
type USAccount = z.infer<typeof usAccountSchema>;

const usAccountDefaultValues: USAccount = {
  account_number: '',
  routing_number: '',
  checking_or_savings: 'checking',
};

const formSchema = z
  .object({
    currency: z.enum(['usd', 'eur']), // Corresponds to to account_type us and iban (added on submit)
    bank_name: z.string().min(1).max(256).optional(),
    account_owner_name: z
      .string()
      .min(3)
      .max(35)
      // See https://apidocs.bridge.xyz/reference/post_customers-customerid-external-accounts
      .regex(/^(?!\s*$)[\x20-\x7E]*$/, {
        message: 'Name contains invalid characters',
      }),

    // Required when currency is eur, but we will just always send a default of individual
    account_owner_type: z.enum(['individual', 'business']),

    // Required when account_owner_type is business
    business_name: z.string().optional(),

    // Only for currency usd
    account: usAccountSchema,

    // Only for currency eur
    // iban: ibanAccountSchema

    // Address
    ...addressSchema.shape,
  })
  .superRefine(({ account_owner_type, business_name }, ctx) => {
    if (account_owner_type === 'business' && business_name === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Business name is required for business accounts',
        path: ['business_name'],
      });
    }
  });

export type BankRecipientFormValuesInternal = z.infer<typeof formSchema>;
export type BankRecipientFormValues = BankRecipientFormValuesInternal & {
  account_type: 'us' | 'iban';
};

const bankRecipientDefaultValues: BankRecipientFormValuesInternal = {
  currency: 'usd',
  account_owner_type: 'individual',
  business_name: '',
  account_owner_name: '',
  account: usAccountDefaultValues,
  ...addressDefaultValues,
};

export const BankRecipientFormContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<BankRecipientFormValuesInternal>({
    resolver: zodResolver(formSchema),
    defaultValues: bankRecipientDefaultValues,
    mode: 'onBlur',
  });

  return <Form {...form}>{children}</Form>;
};

const useBankRecipientForm = () =>
  useFormContext<BankRecipientFormValuesInternal>();

/** The ID of the bank recipient form. Used to link the form to the submit button */
const BANK_RECIPIENT_FORM_ID = 'bank-recipient-form';

// Add the remaining values we need to send this to bridge
// TODO: We are in active conversation with bridge about if we are required to include first_name and last_name
// If so, we can either extract them from the account_owner_name
// or we can change the form to include them and build account_owner_name from them
// For now, we will omit them since EA's seem to work without them
const inferRemainingValues = (
  values: BankRecipientFormValuesInternal
): BankRecipientFormValues => {
  return {
    ...values,
    account_type: values.currency === 'usd' ? 'us' : 'iban',
  };
};

/**
 * The bank recipient form without a form context or submit button
 *
 * Use within a BankRecipientFormContext
 */
export const NakedBankRecipientForm = ({
  onSubmit,
}: {
  onSubmit?: (values: BankRecipientFormValues) => Promise<void>;
}) => {
  async function handleSubmit(values: BankRecipientFormValuesInternal) {
    const cleanedValues = removeEmptyStrings(values); // Clean the values by removing empty strings recursively
    const transformedValues = inferRemainingValues(cleanedValues); // Infer the remaining values bridge needs
    await onSubmit?.(transformedValues);
  }

  const form = useBankRecipientForm();

  const { account_owner_type, currency } = useWatch({ control: form.control });
  const showBusinessName = account_owner_type === 'business';

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='mx-auto w-full max-w-sm space-y-4 p-1'
      id={BANK_RECIPIENT_FORM_ID}
    >
      <FormField
        control={form.control}
        name='currency'
        render={({ field }) => (
          <FormItem>
            <div className='flex h-5 items-center gap-1'>
              <FormLabel>Currency</FormLabel>
              <InfoTooltip>
                Bank must be able to receive {currency?.toUpperCase()}
              </InfoTooltip>
            </div>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select a currency' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='usd'>USD</SelectItem>
                {/* <SelectItem value='EUR'>EUR</SelectItem> */}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='bank_name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank name</FormLabel>
            <FormControl>
              <Input placeholder='The name of your bank' type='' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='account_owner_name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Owner</FormLabel>
            <FormControl>
              <Input placeholder='First Last' type='' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='account_owner_type'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Tabs onValueChange={field.onChange} defaultValue={field.value}>
                <TabsList className='w-full'>
                  <TabsTrigger
                    value='individual'
                    className='flex-1'
                    onClick={() => {
                      form.setValue('business_name', '', {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    Individual
                  </TabsTrigger>
                  <TabsTrigger
                    value='business'
                    className='flex-1'
                    onClick={() => {
                      form.trigger('business_name', { shouldFocus: true });
                    }}
                  >
                    Business
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showBusinessName && (
        <FormField
          control={form.control}
          name='business_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder='Business Name' type='' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name='account.checking_or_savings'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || 'checking'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select account type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='checking'>Checking</SelectItem>
                <SelectItem value='savings'>Savings</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='account.account_number'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input placeholder='Account number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='account.routing_number'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Routing Number</FormLabel>
            <FormControl>
              <Input placeholder='9-digit routing number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AddressFormFields />
    </form>
  );
};

/**
 * Submit button for the bank recipient form
 *
 * Use within a BankRecipientFormContext
 */
export const BankRecipientSubmitButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const form = useBankRecipientForm();
  const { isValid, isSubmitting } = useFormState({ control: form.control });

  return (
    <Button
      ref={ref}
      variant='sorbet'
      type='submit'
      form={BANK_RECIPIENT_FORM_ID}
      disabled={!isValid || isSubmitting}
      className={cn(className, 'w-fit')}
      {...props}
    >
      {isSubmitting && <Spinner />}
      {isSubmitting ? 'Saving...' : 'Save'}
    </Button>
  );
});
