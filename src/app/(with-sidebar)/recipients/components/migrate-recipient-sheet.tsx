'use client';

import { ArrowLeft, Info } from 'lucide-react';
import { forwardRef, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { iso31661 } from 'iso-3166';

import {
  MigrateRecipientDto,
  RecipientAPI,
  RecipientAPIBankDetailed,
} from '@/api/recipients/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/common/spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { useMigrateRecipient } from '../hooks/use-migrate-recipient';
import {
  BankRecipientFormContext,
  BankRecipientFormValues,
  BankRecipientSubmitButton,
  NakedBankRecipientForm,
} from './bank-recipient-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

// ============================================
// Migration Form Wrapper Component
// Adds conditional fields and notes for migration
// ============================================

interface MigrationFormWrapperProps {
  externalAccount?: RecipientAPIBankDetailed['externalAccount'];
  onSubmit: (values: BankRecipientFormValues) => Promise<void>;
}

const MigrationFormWrapper = ({
  externalAccount,
  onSubmit,
}: MigrationFormWrapperProps) => {
  const form = useFormContext<BankRecipientFormValues>();
  const paymentMethod = useWatch({ control: form.control, name: 'paymentMethod' });
  const isSwiftMethod = paymentMethod === 'usd_swift' || paymentMethod === 'eur_swift';
  const isUsdSwift = paymentMethod === 'usd_swift';
  const hasBridgeRoutingNumber = !!externalAccount?.account?.routing_number;

  return (
    <>
      {/* Show note for SWIFT methods */}
      {isSwiftMethod && (
        <Alert>
          <Info className='size-4' />
          <AlertDescription>
            SWIFT methods will be migrated to{' '}
            {isUsdSwift ? 'ACH (USD)' : 'SEPA (EUR)'}. All required fields must
            be provided.
          </AlertDescription>
        </Alert>
      )}

      {/* Conditional routing number field for usd_swift when Bridge data missing */}
      {isUsdSwift && !hasBridgeRoutingNumber && (
        <Card>
          <CardContent className='space-y-3 p-4'>
            <FormField
              control={form.control}
              name='usBank.routingNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter 9-digit routing number'
                      maxLength={9}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Main form */}
      <NakedBankRecipientForm onSubmit={onSubmit} />
    </>
  );
};

// ============================================
// Props
// ============================================

interface MigrateRecipientSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipient: RecipientAPI | null;
  recipientDetails: RecipientAPIBankDetailed | null;
  onSuccess?: () => void;
}

// ============================================
// Main Component
// ============================================

export const MigrateRecipientSheet = ({
  open,
  setOpen,
  recipient,
  recipientDetails,
  onSuccess,
}: MigrateRecipientSheetProps) => {
  const isMobile = useIsMobile();
  const direction = isMobile ? 'bottom' : 'right';

  const { mutateAsync: migrate, isPending } = useMigrateRecipient();

  // Build initial form values from Bridge data (if available)
  const initialValues = useMemo(() => {
    if (!recipient) return undefined;

    const externalAccount = recipientDetails?.externalAccount;
    const isBridgeRecipient = recipient.type === 'usd' || recipient.type === 'eur';
    
    // Determine default payment method based on recipient type
    // Map legacy types and Due Network types to form payment methods
    const getDefaultPaymentMethod = (): BankRecipientFormValues['paymentMethod'] => {
      if (recipient.type === 'eur' || recipient.type === 'eur_sepa') {
        return 'eur_sepa';
      }
      if (recipient.type === 'eur_swift') {
        return 'eur_swift';
      }
      if (recipient.type === 'aed_local') {
        return 'aed_local';
      }
      if (recipient.type === 'usd' || recipient.type === 'usd_ach') {
        return 'usd_ach';
      }
      if (recipient.type === 'usd_wire') {
        return 'usd_wire';
      }
      if (recipient.type === 'usd_swift') {
        return 'usd_swift';
      }
      return 'usd_ach'; // Default fallback
    };
    const defaultPaymentMethod = getDefaultPaymentMethod();

    // Parse name from recipient label or Bridge data
    const nameParts = externalAccount?.account_owner_name?.split(' ') || recipient.label.split(' ');
    const firstName = externalAccount?.first_name || nameParts[0] || '';
    const lastName = externalAccount?.last_name || nameParts.slice(1).join(' ') || '';
    const isBusiness = externalAccount?.account_owner_type === 'business';
    const companyName = externalAccount?.business_name || (isBusiness ? recipient.label : '');

    // Build initial values
    const values: Partial<BankRecipientFormValues> = {
      paymentMethod: defaultPaymentMethod,
      accountType: isBusiness ? 'business' : 'individual',
      firstName: !isBusiness ? firstName : undefined,
      lastName: !isBusiness ? lastName : undefined,
      companyName: isBusiness ? companyName : undefined,
    };

    // Prefill USD fields if Bridge data available
    if (externalAccount?.account) {
      values.usBank = {
        routingNumber: externalAccount.account.routing_number || '',
        accountNumber: '', // User must enter full account number
      };
    }

    // Prefill EUR/AED IBAN if Bridge data available (we only have last 4, so leave empty)
    if (externalAccount?.iban) {
      values.iban = {
        IBAN: '', // User must enter full IBAN
      };
    }

    // Prefill address if Bridge data available (for USD methods that require full address)
    const requiresFullAddress = ['usd_ach', 'usd_wire', 'usd_swift'].includes(defaultPaymentMethod);
    if (externalAccount && requiresFullAddress) {
      // Try to get country from IBAN country code or default
      let countryCode = 'USA';
      if (externalAccount.iban?.country) {
        // Map country code to ISO alpha3
        const country = iso31661.find(
          (c) => c.alpha2 === externalAccount.iban?.country
        );
        if (country) {
          countryCode = country.alpha3;
        }
      }

      values.beneficiaryAddress = {
        street_line_1: '',
        street_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: countryCode,
      };
    } else if (defaultPaymentMethod === 'aed_local') {
      values.minimalAddress = {
        street_line_1: '',
      };
    }

    return values;
  }, [recipient, recipientDetails]);

  const handleSubmit = useCallback(
    async (values: BankRecipientFormValues) => {
      if (!recipient) return;

      // Transform form values to migration DTO
      // Map payment methods: usd_wire/usd_swift -> usd_ach, eur_swift -> eur_sepa
      let migrationPaymentMethod: MigrateRecipientDto['paymentMethod'] = 'usd_ach';
      if (values.paymentMethod === 'eur_sepa' || values.paymentMethod === 'eur_swift') {
        migrationPaymentMethod = 'eur_sepa';
      } else if (values.paymentMethod === 'aed_local') {
        migrationPaymentMethod = 'aed_local';
      } else {
        // usd_ach, usd_wire, usd_swift all map to usd_ach for migration
        migrationPaymentMethod = 'usd_ach';
      }

      const migrateDto: MigrateRecipientDto = {
        paymentMethod: migrationPaymentMethod,
      };

      // Handle USD methods (ACH, Wire, SWIFT) - all map to usd_ach
      if (
        values.paymentMethod === 'usd_ach' ||
        values.paymentMethod === 'usd_wire' ||
        values.paymentMethod === 'usd_swift'
      ) {
        // For SWIFT, use swift account number; for ACH/Wire, use usBank account number
        migrateDto.accountNumber =
          values.paymentMethod === 'usd_swift'
            ? values.swift?.swiftAccountNumber
            : values.usBank?.accountNumber;

        // Routing number: from Bridge data, or user input (for ACH/Wire/SWIFT)
        const routingNumberFromBridge =
          recipientDetails?.externalAccount?.account?.routing_number;
        const routingNumberFromUser = values.usBank?.routingNumber;

        if (routingNumberFromBridge) {
          // Use Bridge routing number (handled in backend)
        } else if (routingNumberFromUser) {
          migrateDto.routingNumber = routingNumberFromUser;
        }
        // If neither exists, backend will throw error

        migrateDto.beneficiaryAddress = values.beneficiaryAddress
          ? {
              street_line_1: values.beneficiaryAddress.street_line_1,
              street_line_2: values.beneficiaryAddress.street_line_2,
              city: values.beneficiaryAddress.city,
              state: values.beneficiaryAddress.state,
              postal_code: values.beneficiaryAddress.postal_code,
              country: values.beneficiaryAddress.country,
            }
          : undefined;
      }
      // Handle EUR methods (SEPA, SWIFT) - both map to eur_sepa
      else if (
        values.paymentMethod === 'eur_sepa' ||
        values.paymentMethod === 'eur_swift'
      ) {
        migrateDto.iban = values.iban?.IBAN;
        // SWIFT also requires address, SEPA doesn't
        if (values.paymentMethod === 'eur_swift' && values.beneficiaryAddress) {
          migrateDto.beneficiaryAddress = {
            street_line_1: values.beneficiaryAddress.street_line_1,
            street_line_2: values.beneficiaryAddress.street_line_2,
            city: values.beneficiaryAddress.city,
            state: values.beneficiaryAddress.state,
            postal_code: values.beneficiaryAddress.postal_code,
            country: values.beneficiaryAddress.country,
          };
        }
      }
      // Handle AED
      else if (values.paymentMethod === 'aed_local') {
        migrateDto.iban = values.iban?.IBAN;
        migrateDto.minimalAddress = values.minimalAddress
          ? {
              street_line_1: values.minimalAddress.street_line_1,
            }
          : undefined;
      }

      try {
        await migrate({
          recipientId: recipient.id,
          data: migrateDto,
        });
        setOpen(false);
        onSuccess?.();
      } catch {
        // Error is handled by the hook
      }
    },
    [migrate, recipient, recipientDetails, setOpen, onSuccess]
  );

  if (!recipient) return null;

  const externalAccount = recipientDetails?.externalAccount;

  return (
    <VaulSheet open={open} onOpenChange={setOpen} direction={direction}>
      <VaulSheetContent direction={direction}>
        <VaulSheetHeader>
          <BackButton onClick={() => setOpen(false)} />
          <VaulSheetTitle>Update Recipient</VaulSheetTitle>
          <VaulSheetDescription>
            We need a few more details to enable transfers
          </VaulSheetDescription>
        </VaulSheetHeader>

        <BankRecipientFormContext initialValues={initialValues}>
          <ScrollArea className={cn(isMobile && 'overflow-y-auto')}>
            <div className='space-y-4 px-1'>
              {/* Recipient Info Display */}
              <Alert>
                <Info className='size-4' />
                <AlertDescription>
                  <span className='font-medium'>{recipient.label}</span>
                  {externalAccount?.bank_name && (
                    <span className='text-muted-foreground'>
                      {' '}
                      • {externalAccount.bank_name}
                    </span>
                  )}
                  {externalAccount?.account?.last_4 && (
                    <span className='text-muted-foreground'>
                      {' '}
                      • Account ending in ****{externalAccount.account.last_4}
                    </span>
                  )}
                  {externalAccount?.iban?.last_4 && (
                    <span className='text-muted-foreground'>
                      {' '}
                      • IBAN ending in ****{externalAccount.iban.last_4}
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {/* Reuse the same form as "Add New Recipient" */}
              <MigrationFormWrapper
                externalAccount={externalAccount}
                onSubmit={handleSubmit}
              />
            </div>
          </ScrollArea>

          <VaulSheetFooter>
            <BankRecipientSubmitButton className='w-full'>
              {isPending ? (
                <>
                  <Spinner className='mr-2' />
                  Updating...
                </>
              ) : (
                'Update Recipient'
              )}
            </BankRecipientSubmitButton>
          </VaulSheetFooter>
        </BankRecipientFormContext>
      </VaulSheetContent>
    </VaulSheet>
  );
};

// ============================================
// Helper Components
// ============================================

const BackButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { className?: string }
>(({ className, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant='ghost'
      size='icon'
      className={cn('group -ml-1 size-6', className)}
      onClick={onClick}
      {...props}
    >
      <ArrowLeft className='transition-transform ease-in-out group-hover:-translate-x-[2px]' />
    </Button>
  );
});
BackButton.displayName = 'BackButton';
