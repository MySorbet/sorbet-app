'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { isISO31661Alpha3 } from 'validator';
import * as z from 'zod';

import { CountryDropdown } from '@/app/(with-sidebar)/recipients/components/country-dropdown';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const IBANAccountSchema = z.object({
  account_number: z.string().min(1, 'Account number is required'),
  bic: z.string().min(1, 'Bank identifier code is required'),
  country: z.string().refine((val) => isISO31661Alpha3(val), {
    message: 'Invalid country code',
  }),
});
type IBANAccount = z.infer<typeof IBANAccountSchema>;

const IBANAccountDefaultValues: IBANAccount = {
  account_number: '',
  bic: '',
  country: '',
};

const formSchemaBase = z.object({
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

  // Discriminated union below
  account: usAccountSchema.optional(),
  iban: IBANAccountSchema.optional(),

  // Address
  ...addressSchema.shape,
});

const formSchemaUSD = z.object({
  ...formSchemaBase.shape,
  currency: z.literal('usd'),
  account: usAccountSchema,
});

const formSchemaEUR = z.object({
  ...formSchemaBase.shape,
  currency: z.literal('eur'),
  iban: IBANAccountSchema,
});

const formSchema = z
  .discriminatedUnion('currency', [formSchemaUSD, formSchemaEUR])
  .superRefine(({ account_owner_type, business_name }, ctx) => {
    if (account_owner_type === 'business' && business_name === '') {
      // TODO: Perhaps this could be done with composition instead?
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
  iban: IBANAccountDefaultValues,
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

  const showIBAN = currency === 'eur';
  const showAccount = currency === 'usd';

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
              onValueChange={(value) => {
                field.onChange(value);
                // Reset opposite account on change
                value === 'usd'
                  ? form.setValue('iban', IBANAccountDefaultValues, {
                      shouldDirty: true,
                    })
                  : form.setValue('account', usAccountDefaultValues, {
                      shouldDirty: true,
                    });
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select a currency' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='usd'>USD</SelectItem>
                <SelectItem value='eur'>EUR</SelectItem>
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

      {/* US Account */}
      {showAccount && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Account</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
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
          </CardContent>
        </Card>
      )}

      {/* IBAN */}
      {showIBAN && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>IBAN</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FormField
              control={form.control}
              name='iban.account_number'
              render={({ field }) => (
                <FormItem>
                  {/* TODO: rename to account number and dedup with account number? */}
                  <FormLabel>IBAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder='IBAN number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='iban.bic'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Identifier Code</FormLabel>
                  <FormControl>
                    <Input placeholder='BIC' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='iban.country'
              render={({ field }) => (
                <FormItem>
                  <div className='flex h-5 items-center gap-1'>
                    <FormLabel>Country</FormLabel>
                    <InfoTooltip>
                      Country in which the bank account is located
                    </InfoTooltip>
                  </div>
                  <CountryDropdown
                    placeholder='Select a country'
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.alpha3);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

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
