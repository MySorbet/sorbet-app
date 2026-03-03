'use client';

import { kebabCase } from 'lodash';
import { LockKeyhole } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDueFeeStructures } from '@/hooks/profile/use-due-fee-structures';
import { cn, formatWalletAddress } from '@/lib/utils';

import { useInvoiceForm } from '../../hooks/use-invoice-form';
import { type AcceptedPaymentMethod } from '../../schema';

type VirtualPaymentMethod =
  | 'usd_ach'
  | 'usd_wire'
  | 'usd_swift'
  | 'eur_sepa'
  | 'eur_swift'
  | 'aed_local';

type VirtualCurrency = 'usd' | 'eur' | 'aed';

const VIRTUAL_METHODS: {
  value: VirtualPaymentMethod;
  label: string;
  flag: string;
  /** The currency this rail belongs to — maps to the AcceptedPaymentMethod sent to the backend */
  legacyMethod: VirtualCurrency;
  /** Which endorsement flag must be true for this rail to be selectable */
  endorsedBy: 'base' | 'eur' | 'aed';
}[] = [
  { value: 'usd_ach', label: 'USD (ACH)', flag: '🇺🇸', legacyMethod: 'usd', endorsedBy: 'base' },
  { value: 'usd_wire', label: 'USD (WIRE)', flag: '🇺🇸', legacyMethod: 'usd', endorsedBy: 'base' },
  { value: 'usd_swift', label: 'USD (SWIFT)', flag: '🇺🇸', legacyMethod: 'usd', endorsedBy: 'base' },
  { value: 'eur_sepa', label: 'EUR (SEPA)', flag: '🇪🇺', legacyMethod: 'eur', endorsedBy: 'eur' },
  { value: 'eur_swift', label: 'EUR (SWIFT)', flag: '🇪🇺', legacyMethod: 'eur', endorsedBy: 'eur' },
  { value: 'aed_local', label: 'AED (Local Transfer)', flag: '🇦🇪', legacyMethod: 'aed', endorsedBy: 'aed' },
];

/** Which virtual rails are available for each invoice currency */
const CURRENCY_TO_RAILS: Record<string, VirtualPaymentMethod[]> = {
  USD: ['usd_ach', 'usd_wire', 'usd_swift'],
  EUR: ['eur_sepa', 'eur_swift'],
  AED: ['aed_local'],
};

/**
 * The 2nd tab of the invoice controls, "Payment"
 * - Renders the payment tab allowing the user to choose which payment methods to accept
 * - Manipulates form data via `useInvoiceForm`
 */
export const PaymentTab = ({
  isBaseEndorsed,
  isEurEndorsed,
  isAedEndorsed,
  onGetVerified,
  walletAddress,
  stellarWalletAddress,
}: {
  /** Whether the user is endorsed for USD payments. `undefined` means still loading. */
  isBaseEndorsed?: boolean;
  /** Whether the user is endorsed for EUR payments. `undefined` means still loading. */
  isEurEndorsed?: boolean;
  /** Whether the user is endorsed for AED payments. `undefined` means still loading. */
  isAedEndorsed?: boolean;
  /** Callback indicating the user wants to get verified */
  onGetVerified?: (currency: 'usd' | 'eur' | 'aed') => void;
  /** The user's Base wallet address for the USDC payment method. */
  walletAddress?: string;
  /** The user's Stellar wallet address for the USDC Stellar network option. */
  stellarWalletAddress?: string;
}) => {
  const form = useInvoiceForm();
  const { data: dueFeeStructures } = useDueFeeStructures();

  const invoiceCurrency = form.watch('currency') ?? 'USD';
  const availableVirtualMethods = useMemo(() => {
    const currencyRails = CURRENCY_TO_RAILS[invoiceCurrency] ?? CURRENCY_TO_RAILS.USD;
    const currencyMethods = VIRTUAL_METHODS.filter((m) => currencyRails.includes(m.value));

    // While endorsements are still loading, show all currency-appropriate methods
    // (the checkbox itself will be in skeleton state, so the dropdown won't be used)
    if (isBaseEndorsed === undefined && isEurEndorsed === undefined && isAedEndorsed === undefined) {
      return currencyMethods;
    }

    // Filter down to only the rails the user actually has a Due account for
    return currencyMethods.filter((m) => {
      if (m.endorsedBy === 'base') return isBaseEndorsed === true;
      if (m.endorsedBy === 'eur') return isEurEndorsed === true;
      if (m.endorsedBy === 'aed') return isAedEndorsed === true;
      return false;
    });
  }, [invoiceCurrency, isBaseEndorsed, isEurEndorsed, isAedEndorsed]);

  // Initialise selected virtual method from form state so existing prefills are respected,
  // and seed virtualPaymentRail immediately so the invoice document can look up the fee row.
  const [selectedVirtualMethod, setSelectedVirtualMethod] =
    useState<VirtualPaymentMethod>(() => {
      const methods = form.getValues('paymentMethods');
      const initial: VirtualPaymentMethod = methods.includes('eur')
        ? 'eur_sepa'
        : methods.includes('aed')
          ? 'aed_local'
          : 'usd_ach';
      // Seed on first render — no separate mount effect needed.
      if (!form.getValues('virtualPaymentRail')) {
        form.setValue('virtualPaymentRail', initial);
      }
      return initial;
    });

  // Keep a ref so effects can always read the latest value without adding it
  // to their dependency array (avoids stale closures without infinite loops).
  const selectedVirtualMethodRef = useRef(selectedVirtualMethod);
  selectedVirtualMethodRef.current = selectedVirtualMethod;

  // When invoice currency changes, reset to the first available rail for that currency.
  useEffect(() => {
    const firstForCurrency = availableVirtualMethods[0];
    if (!firstForCurrency) return;

    const isCurrentStillValid = availableVirtualMethods.some(
      (m) => m.value === selectedVirtualMethodRef.current
    );
    if (isCurrentStillValid) return;

    setSelectedVirtualMethod(firstForCurrency.value);
    form.setValue('virtualPaymentRail', firstForCurrency.value);

    // Sync form paymentMethods: remove old currency, add new one
    const current = form.getValues('paymentMethods');
    const oldLegacy = (
      VIRTUAL_METHODS.find((m) => m.value === selectedVirtualMethodRef.current) ??
      VIRTUAL_METHODS[0]
    ).legacyMethod;
    const newLegacy = firstForCurrency.legacyMethod;

    const updated = current.filter(
      (m) => m !== oldLegacy
    ) as AcceptedPaymentMethod[];
    if (!updated.includes(newLegacy as AcceptedPaymentMethod)) {
      updated.push(newLegacy as AcceptedPaymentMethod);
    }
    form.setValue('paymentMethods', updated, { shouldValidate: true });
  }, [availableVirtualMethods, form]);

  const isLoading =
    isBaseEndorsed === undefined &&
    isEurEndorsed === undefined &&
    isAedEndorsed === undefined;
  const isVirtualEndorsed =
    isBaseEndorsed === true || isEurEndorsed === true || isAedEndorsed === true;
  // Lock if not verified at all, OR if verified but no Due account exists for this invoice's currency
  const isVirtualLocked = !isLoading && (!isVirtualEndorsed || availableVirtualMethods.length === 0);

  const selectedMethodMeta =
    VIRTUAL_METHODS.find((m) => m.value === selectedVirtualMethod) ??
    availableVirtualMethods[0] ??
    VIRTUAL_METHODS[0];

  /** Resolve the static_deposit fee row for a given virtual rail.
   *  Prefers accountType='any', then 'individual', then any available row. */
  const resolveFeeRow = (paymentMethod: VirtualPaymentMethod) => {
    const candidates =
      dueFeeStructures?.filter(
        (r) => r.paymentMethod === paymentMethod && r.channelType === 'static_deposit'
      ) ?? [];
    return (
      candidates.find((r) => r.accountType === 'any') ??
      candidates.find((r) => r.accountType === 'individual') ??
      candidates[0]
    );
  };

  const selectedFeeRow = resolveFeeRow(selectedVirtualMethod);
  const virtualFeeBps = selectedFeeRow?.totalFeeBps ?? 0;
  const virtualFixedFee = selectedFeeRow ? parseFloat(selectedFeeRow.totalFixedFee) : 0;
  const hasFee = virtualFeeBps > 0 || virtualFixedFee > 0;

  const handleVirtualMethodChange = (newMethod: VirtualPaymentMethod) => {
    const oldLegacy = selectedMethodMeta.legacyMethod;
    const newMeta =
      VIRTUAL_METHODS.find((m) => m.value === newMethod) ?? VIRTUAL_METHODS[0];
    const newLegacy = newMeta.legacyMethod;

    setSelectedVirtualMethod(newMethod);
    form.setValue('virtualPaymentRail', newMethod);

    // Keep the form paymentMethods in sync when the currency category changes
    if (oldLegacy !== newLegacy) {
      const current = form.getValues('paymentMethods');
      const updated = current.filter(
        (m) => m !== oldLegacy
      ) as AcceptedPaymentMethod[];
      if (!updated.includes(newLegacy as AcceptedPaymentMethod)) {
        updated.push(newLegacy as AcceptedPaymentMethod);
      }
      form.setValue('paymentMethods', updated, { shouldValidate: true });
    }
  };

  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6'>
        <CardTitle className='text-base font-semibold'>
          Accepted payment methods
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        {/* ── USDC ─────────────────────────────────────────────── */}
        <UsdcPaymentMethod
          walletAddress={walletAddress}
          stellarWalletAddress={stellarWalletAddress}
        />

        {/* ── Virtual payments ─────────────────────────────────── */}
        <div className={cn('group flex w-full gap-4')}>
          {isLoading ? (
            <Skeleton className='mt-2 size-4 shrink-0 rounded' />
          ) : isVirtualLocked ? (
            <LockKeyhole className='text-muted-foreground mt-2 size-4 shrink-0' />
          ) : (
            <FormField
              control={form.control}
              name='paymentMethods'
              render={({ field }) => {
                const hasVirtual =
                  field.value.includes('usd') ||
                  field.value.includes('eur') ||
                  field.value.includes('aed');
                const isLastSelected =
                  field.value.length === 1 && hasVirtual;

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Checkbox
                          checked={hasVirtual}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (!field.value.includes(selectedMethodMeta.legacyMethod)) {
                                field.onChange([
                                  ...field.value,
                                  selectedMethodMeta.legacyMethod,
                                ]);
                              }
                          } else {
                            field.onChange(
                              field.value.filter(
                                (m) => m !== 'usd' && m !== 'eur' && m !== 'aed'
                              )
                            );
                          }
                          }}
                          disabled={isLastSelected}
                          id='accept-virtual-payments'
                          className='mt-2'
                          aria-label={`Accept Virtual Payments${isLastSelected ? ' (required)' : ''}`}
                        />
                      </div>
                    </TooltipTrigger>
                    {isLastSelected && (
                      <TooltipContent>
                        At least one payment method is required
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              }}
            />
          )}

          <div className='flex flex-col gap-2 pb-3 pr-3 pt-1'>
            {/* Header row */}
            <div className='flex w-full items-center gap-1'>
              <Label
                className='text-sm font-medium'
                htmlFor='accept-virtual-payments'
              >
                Accept Virtual Payments
              </Label>
              <InfoTooltip>
                Your virtual bank account to receive ACH / WIRE / SWIFT / SEPA
                payments
              </InfoTooltip>
              {!isLoading && availableVirtualMethods.length > 0 && (
                <span className='text-sorbet-blue ml-auto text-right text-xs'>
                  {PAYMENT_TIMING_DESCRIPTIONS.bank}
                </span>
              )}
            </div>

            <p className='text-muted-foreground text-sm'>
              {invoiceCurrency === 'AED'
                ? 'Your clients can pay via local AED transfer to your virtual bank account'
                : invoiceCurrency === 'EUR'
                  ? 'Your clients can pay via SEPA/SWIFT to your virtual bank account'
                  : 'Your clients can pay via ACH/WIRE/SWIFT to your virtual bank account'}
            </p>

            {/* Body — depends on endorsement state */}
            {isLoading ? (
              <Skeleton className='h-9 w-full' />
            ) : isVirtualLocked ? (
              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  const currency =
                    invoiceCurrency === 'EUR'
                      ? 'eur'
                      : invoiceCurrency === 'AED'
                        ? 'aed'
                        : 'usd';
                  onGetVerified?.(currency);
                }}
              >
                Get verified in minutes
              </Button>
            ) : (
              <div className='space-y-1.5'>
                <div className='flex items-center gap-1'>
                  <Label className='text-muted-foreground text-xs font-medium'>
                    Select payment method
                  </Label>
                  <InfoTooltip>
                    Choose which payment rail your clients will use
                  </InfoTooltip>
                </div>
                <Select
                  value={selectedVirtualMethod}
                  onValueChange={(v) =>
                    handleVirtualMethodChange(v as VirtualPaymentMethod)
                  }
                >
                  <SelectTrigger className='h-9 bg-background'>
                    <span className='flex items-center gap-2'>
                      <span>{selectedMethodMeta.flag}</span>
                      <span>{selectedMethodMeta.label}</span>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {availableVirtualMethods.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <span className='flex items-center gap-2'>
                          <span>{m.flag}</span>
                          <span>{m.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasFee && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Transaction fee:{' '}
                    {virtualFeeBps > 0 ? `${(virtualFeeBps / 100).toFixed(2)}%` : ''}
                    {virtualFeeBps > 0 && virtualFixedFee > 0 ? ' + ' : ''}
                    {virtualFixedFee > 0 ? `$${virtualFixedFee.toFixed(2)} fixed` : ''}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type ChainOption = 'base' | 'stellar';

const CHAIN_META: Record<
  ChainOption,
  { label: string; logoSrc: string; logoAlt: string }
> = {
  base: { label: 'Base', logoSrc: '/svg/base_logo.svg', logoAlt: 'Base' },
  stellar: {
    label: 'Stellar',
    logoSrc: '/svg/stellar_logo.svg',
    logoAlt: 'Stellar',
  },
};

/** USDC payment method row with wallet address and network selector */
const UsdcPaymentMethod = ({
  walletAddress,
  stellarWalletAddress,
}: {
  walletAddress?: string;
  stellarWalletAddress?: string;
}) => {
  const form = useInvoiceForm();
  const [selectedChain, setSelectedChain] = useState<ChainOption>('base');

  const activeAddress =
    selectedChain === 'stellar' ? stellarWalletAddress : walletAddress;
  const formattedAddress =
    activeAddress && formatWalletAddress(activeAddress);

  const chainMeta = CHAIN_META[selectedChain];

  return (
    <div className={cn('group flex w-full gap-4')}>
      <FormField
        control={form.control}
        name='paymentMethods'
        render={({ field }) => {
          const isLastSelected =
            field.value.length === 1 && field.value.includes('usdc');

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={field.value.includes('usdc')}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked
                          ? [...field.value, 'usdc']
                          : field.value.filter((m) => m !== 'usdc')
                      );
                    }}
                    disabled={isLastSelected}
                    id={kebabCase('Accept USDC Payments')}
                    className='mt-2'
                    aria-label={`Accept USDC Payments${isLastSelected ? ' (required)' : ''}`}
                  />
                </div>
              </TooltipTrigger>
              {isLastSelected && (
                <TooltipContent>
                  At least one payment method is required
                </TooltipContent>
              )}
            </Tooltip>
          );
        }}
      />

      <div className='flex flex-col gap-2 pb-3 pr-3 pt-1'>
        {/* Header row */}
        <div className='flex w-full items-center gap-1'>
          <Label
            className='text-sm font-medium'
            htmlFor={kebabCase('Accept USDC Payments')}
          >
            Accept USDC Payments
          </Label>
          <InfoTooltip>
            Your crypto wallet to receive instant USDC payments
          </InfoTooltip>
          <span className='text-sorbet-blue ml-auto text-right text-xs'>
            {PAYMENT_TIMING_DESCRIPTIONS.crypto}
          </span>
        </div>

        {/* Wallet address */}
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>My Sorbet Wallet</span>
          <div className='flex items-center gap-1 text-sm'>
            {formattedAddress ?? <Skeleton className='h-5 w-24' />}
            <CopyIconButton
              stringToCopy={activeAddress}
              className='ml-1'
              disabled={!activeAddress}
              aria-label='Copy wallet address'
            />
          </div>
        </div>

        {/* Network selector */}
        <div className='space-y-1.5'>
          <div className='flex items-center gap-1'>
            <Label className='text-muted-foreground text-xs font-medium'>
              Network
            </Label>
            <InfoTooltip>
              The blockchain network payments are received on
            </InfoTooltip>
          </div>
          <Select
            value={selectedChain}
            onValueChange={(v) => setSelectedChain(v as ChainOption)}
          >
            <SelectTrigger className='h-9 bg-background'>
              <span className='flex items-center gap-2 text-sm'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={chainMeta.logoSrc}
                  alt={chainMeta.logoAlt}
                  width={16}
                  height={16}
                  className='inline-block shrink-0'
                />
                <span>{chainMeta.label}</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CHAIN_META) as ChainOption[]).map((k) => (
                <SelectItem key={k} value={k}>
                  <span className='flex items-center gap-2'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CHAIN_META[k].logoSrc}
                      alt={CHAIN_META[k].logoAlt}
                      width={16}
                      height={16}
                      className='inline-block shrink-0'
                    />
                    <span>{CHAIN_META[k].label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
