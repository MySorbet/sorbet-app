'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useMemo } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { isISO31661Alpha3 } from 'validator';
import * as z from 'zod';

import {
  DuePaymentMethod,
  PAYMENT_METHOD_OPTIONS,
  PaymentMethodOption,
} from '@/api/recipients/types';
import { iso31661 } from 'iso-3166';

import { CountryDropdown } from '@/app/(with-sidebar)/recipients/components/country-dropdown';
import { StateSelect } from '@/app/(with-sidebar)/recipients/components/state-select';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { PaymentMethodSelector } from './payment-method-selector';
import { removeEmptyStrings } from './utils';

// ============================================
// Schemas for different account types
// ============================================

// US Bank Account (ACH/Wire) - allows empty strings, actual validation in superRefine
const usBankSchema = z.object({
  accountNumber: z.string(),
  routingNumber: z.string(),
});

// SWIFT Account - allows empty strings, actual validation in superRefine
const swiftSchema = z.object({
  swiftCode: z.string(),
  swiftAccountNumber: z.string(),
});

// IBAN Account (SEPA/MENA) - allows empty strings, actual validation in superRefine
const ibanSchema = z.object({
  IBAN: z.string().transform((s) => s.replace(/\s+/g, '').toUpperCase()),
});

// Full beneficiary address - allows empty strings, actual validation in superRefine
const fullAddressSchema = z.object({
  street_line_1: z.string(),
  street_line_2: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  postal_code: z.string(),
  country: z.string(),
});

// Minimal address (AED only needs street) - allows empty strings, actual validation in superRefine
const minimalAddressSchema = z.object({
  street_line_1: z.string(),
});

// ============================================
// Main form schema
// ============================================

const formSchema = z
  .object({
    // Payment method selection
    paymentMethod: z.enum([
      'usd_ach',
      'usd_wire',
      'usd_swift',
      'eur_sepa',
      'eur_swift',
      'aed_local',
    ] as const),

    // Account type (individual/business)
    accountType: z.enum(['individual', 'business']),

    // Name fields
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),

    // US Bank fields (ACH/Wire)
    usBank: usBankSchema.optional(),

    // SWIFT fields
    swift: swiftSchema.optional(),

    // IBAN field (SEPA/MENA)
    iban: ibanSchema.optional(),

    // Address fields
    beneficiaryAddress: fullAddressSchema.optional(),
    minimalAddress: minimalAddressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // Validate name based on account type
    if (data.accountType === 'individual') {
      if (!data.firstName || data.firstName.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First name is required',
          path: ['firstName'],
        });
      }
      if (!data.lastName || data.lastName.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Last name is required',
          path: ['lastName'],
        });
      }
    } else {
      if (!data.companyName || data.companyName.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company name is required',
          path: ['companyName'],
        });
      }
    }

    // Validate fields based on payment method
    const method = data.paymentMethod;

    // US Bank required for ACH/Wire
    if (['usd_ach', 'usd_wire'].includes(method)) {
      const accountNumber = data.usBank?.accountNumber?.trim();
      const routingNumber = data.usBank?.routingNumber?.trim();
      
      if (!accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account number is required',
          path: ['usBank', 'accountNumber'],
        });
      }
      if (!routingNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Routing number is required',
          path: ['usBank', 'routingNumber'],
        });
      } else if (routingNumber.length !== 9 || !/^\d+$/.test(routingNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Routing number must be exactly 9 digits',
          path: ['usBank', 'routingNumber'],
        });
      }
      
      const streetAddress = data.beneficiaryAddress?.street_line_1?.trim();
      if (!streetAddress || streetAddress.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Street address is required',
          path: ['beneficiaryAddress', 'street_line_1'],
        });
      }
      if (!data.beneficiaryAddress?.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['beneficiaryAddress', 'city'],
        });
      }
      if (!data.beneficiaryAddress?.postal_code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Postal code is required',
          path: ['beneficiaryAddress', 'postal_code'],
        });
      }
    }

    // SWIFT required for USD/EUR SWIFT
    if (['usd_swift', 'eur_swift'].includes(method)) {
      const swiftCode = data.swift?.swiftCode?.trim();
      const swiftAccountNumber = data.swift?.swiftAccountNumber?.trim();
      
      if (!swiftCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SWIFT code is required',
          path: ['swift', 'swiftCode'],
        });
      } else if (swiftCode.length < 8 || swiftCode.length > 11 || !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(swiftCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid SWIFT/BIC code',
          path: ['swift', 'swiftCode'],
        });
      }
      if (!swiftAccountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account number is required',
          path: ['swift', 'swiftAccountNumber'],
        });
      }
      
      const streetAddress = data.beneficiaryAddress?.street_line_1?.trim();
      if (!streetAddress || streetAddress.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Street address is required',
          path: ['beneficiaryAddress', 'street_line_1'],
        });
      }
      if (!data.beneficiaryAddress?.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['beneficiaryAddress', 'city'],
        });
      }
      if (!data.beneficiaryAddress?.postal_code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Postal code is required',
          path: ['beneficiaryAddress', 'postal_code'],
        });
      }
    }

    // IBAN required for SEPA
    if (method === 'eur_sepa') {
      const ibanValue = data.iban?.IBAN?.trim();
      if (!ibanValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IBAN is required',
          path: ['iban', 'IBAN'],
        });
      } else if (ibanValue.length < 15 || ibanValue.length > 34) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IBAN must be 15-34 characters',
          path: ['iban', 'IBAN'],
        });
      }
      // SEPA doesn't require address
    }

    // IBAN + minimal address required for AED
    if (method === 'aed_local') {
      const ibanValue = data.iban?.IBAN?.trim();
      if (!ibanValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IBAN is required',
          path: ['iban', 'IBAN'],
        });
      } else if (ibanValue.length < 15 || ibanValue.length > 34) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IBAN must be 15-34 characters',
          path: ['iban', 'IBAN'],
        });
      }
      const minimalAddressValue = data.minimalAddress?.street_line_1?.trim();
      if (!minimalAddressValue || minimalAddressValue.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Street address is required (min 5 characters)',
          path: ['minimalAddress', 'street_line_1'],
        });
      }
    }
  });

export type BankRecipientFormValuesInternal = z.infer<typeof formSchema>;

// Output type for submission to API
export type BankRecipientFormValues = BankRecipientFormValuesInternal;

const defaultValues: BankRecipientFormValuesInternal = {
  paymentMethod: 'usd_ach',
  accountType: 'individual',
  firstName: '',
  lastName: '',
  companyName: '',
  usBank: {
    accountNumber: '',
    routingNumber: '',
  },
  swift: {
    swiftCode: '',
    swiftAccountNumber: '',
  },
  iban: {
    IBAN: '',
  },
  beneficiaryAddress: {
    street_line_1: '',
    street_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  },
  minimalAddress: {
    street_line_1: '',
  },
};

export const BankRecipientFormContext = ({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues?: Partial<BankRecipientFormValuesInternal>;
}) => {
  const form = useForm<BankRecipientFormValuesInternal>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      // Merge nested objects properly
      usBank: initialValues?.usBank
        ? { ...defaultValues.usBank, ...initialValues.usBank }
        : defaultValues.usBank,
      swift: initialValues?.swift
        ? { ...defaultValues.swift, ...initialValues.swift }
        : defaultValues.swift,
      iban: initialValues?.iban
        ? { ...defaultValues.iban, ...initialValues.iban }
        : defaultValues.iban,
      beneficiaryAddress: initialValues?.beneficiaryAddress
        ? { ...defaultValues.beneficiaryAddress, ...initialValues.beneficiaryAddress }
        : defaultValues.beneficiaryAddress,
      minimalAddress: initialValues?.minimalAddress
        ? { ...defaultValues.minimalAddress, ...initialValues.minimalAddress }
        : defaultValues.minimalAddress,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return <Form {...form}>{children}</Form>;
};

const useBankRecipientForm = () =>
  useFormContext<BankRecipientFormValuesInternal>();

const BANK_RECIPIENT_FORM_ID = 'bank-recipient-form';

/**
 * The bank recipient form without a form context or submit button
 */
export const NakedBankRecipientForm = ({
  onSubmit,
}: {
  onSubmit?: (values: BankRecipientFormValues) => Promise<void>;
  eurLocked?: boolean; // Kept for backward compatibility, but no longer used
}) => {
  const form = useBankRecipientForm();

  const watchedValues = useWatch({ control: form.control });
  const paymentMethod = watchedValues.paymentMethod ?? 'usd_ach';
  const accountType = watchedValues.accountType ?? 'individual';

  // Determine which fields to show based on payment method
  const showUSBank = ['usd_ach', 'usd_wire'].includes(paymentMethod);
  const showSwift = ['usd_swift', 'eur_swift'].includes(paymentMethod);
  const showIBAN = ['eur_sepa', 'eur_swift', 'aed_local'].includes(paymentMethod);
  const showFullAddress = [
    'usd_ach',
    'usd_wire',
    'usd_swift',
    'eur_swift',
  ].includes(paymentMethod);
  const showMinimalAddress = paymentMethod === 'aed_local';
  const showBusinessName = accountType === 'business';

  // Get selected payment method info
  const selectedMethod = useMemo(
    () => PAYMENT_METHOD_OPTIONS.find((m) => m.id === paymentMethod),
    [paymentMethod]
  );

  // Get the alpha2 code of the selected country for StateSelect
  const country = watchedValues.beneficiaryAddress?.country ?? 'USA';
  const countryAlpha2 = useMemo(
    () => iso31661.find((c) => c.alpha3 === country)?.alpha2,
    [country]
  );

  async function handleSubmit(values: BankRecipientFormValuesInternal) {
    const cleanedValues = removeEmptyStrings(values);
    await onSubmit?.(cleanedValues);
  }

  const handlePaymentMethodChange = (method: PaymentMethodOption) => {
    form.setValue('paymentMethod', method.id, { shouldValidate: true });

    // Reset country based on payment method
    if (['usd_ach', 'usd_wire', 'usd_swift'].includes(method.id)) {
      form.setValue('beneficiaryAddress.country', 'USA');
    } else if (['eur_sepa', 'eur_swift'].includes(method.id)) {
      form.setValue('beneficiaryAddress.country', 'DEU'); // Default to Germany for EUR
    } else if (method.id === 'aed_local') {
      form.setValue('beneficiaryAddress.country', 'ARE');
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='mx-auto w-full max-w-sm space-y-4 p-1'
      id={BANK_RECIPIENT_FORM_ID}
    >
      {/* Payment Method Selection */}
      <FormField
        control={form.control}
        name='paymentMethod'
        render={() => (
          <FormItem>
            <div className='flex h-5 items-center gap-1'>
              <FormLabel>Payment Method</FormLabel>
              <InfoTooltip>
                Select how you want to send funds to this recipient
              </InfoTooltip>
            </div>
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Account Type Selection */}
      <FormField
        control={form.control}
        name='accountType'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>Account Type</FormLabel>
            <FormControl>
              <Tabs
                onValueChange={field.onChange}
                value={field.value}
                className='w-full'
              >
                <TabsList className='w-full'>
                  <TabsTrigger value='individual' className='flex-1'>
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value='business' className='flex-1'>
                    Business
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Name Fields */}
      <div className='space-y-3 border-y border-[#E4E4E7] py-4'>
        <Label>Recipient&apos;s Info</Label>
        {accountType === 'individual' ? (
          <div className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <FormField
            control={form.control}
            name='companyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder='Acme Inc.' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* US Bank Fields (ACH/Wire) */}
      {showUSBank && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <Label className='text-sm font-medium'>Bank Details</Label>
            <FormField
              control={form.control}
              name='usBank.accountNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder='123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='usBank.routingNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input placeholder='021000021' maxLength={9} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* SWIFT Fields */}
      {showSwift && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <Label className='text-sm font-medium'>SWIFT Details</Label>
            <FormField
              control={form.control}
              name='swift.swiftCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT/BIC Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='DEUTDEFF'
                      maxLength={11}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='swift.swiftAccountNumber'
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
          </CardContent>
        </Card>
      )}

      {/* IBAN Field */}
      {showIBAN && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <Label className='text-sm font-medium'>
              {paymentMethod === 'eur_sepa' ? 'SEPA Details' : 'Bank Details'}
            </Label>
            <FormField
              control={form.control}
              name='iban.IBAN'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        paymentMethod === 'aed_local'
                          ? 'AE12 3456 7890 1234 5678 901'
                          : 'DE89 3704 0044 0532 0130 00'
                      }
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Full Address Fields */}
      {showFullAddress && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <div className='flex h-5 items-center gap-1'>
              <Label className='text-sm font-medium'>Beneficiary Address</Label>
              <InfoTooltip>
                Address of the account holder
              </InfoTooltip>
            </div>
            <FormField
              control={form.control}
              name='beneficiaryAddress.street_line_1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complete Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Main Street' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='beneficiaryAddress.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <CountryDropdown
                    placeholder='Select country'
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.alpha3);
                      // Reset the state when country changes
                      form.setValue('beneficiaryAddress.state', '', {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='beneficiaryAddress.state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <StateSelect
                        value={field.value}
                        onChange={field.onChange}
                        parent={countryAlpha2}
                        disabled={!countryAlpha2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='beneficiaryAddress.city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='New York' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='beneficiaryAddress.postal_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder='10001' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Minimal Address (AED only) */}
      {showMinimalAddress && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <div className='flex h-5 items-center gap-1'>
              <Label className='text-sm font-medium'>Beneficiary Address</Label>
              <InfoTooltip>
                Street address of the account holder
              </InfoTooltip>
            </div>
            <FormField
              control={form.control}
              name='minimalAddress.street_line_1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Sheikh Zayed Road' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
    </form>
  );
};

/**
 * Submit button for the bank recipient form
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
      className={cn('w-fit', className)}
      {...props}
    >
      {isSubmitting && <Spinner />}
      {isSubmitting ? 'Saving...' : 'Save'}
    </Button>
  );
});
BankRecipientSubmitButton.displayName = 'BankRecipientSubmitButton';
