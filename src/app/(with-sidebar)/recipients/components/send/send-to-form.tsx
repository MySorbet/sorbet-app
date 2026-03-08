import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { Percentages } from '@/app/(with-sidebar)/recipients/components/send/percentages';
import { PreviewSend } from '@/app/(with-sidebar)/recipients/components/send/preview-send';
import { Processing } from '@/app/(with-sidebar)/recipients/components/send/processing';
import { SendToFormSchema, useSendToContext, useSendToFormContext, useSendToFormState } from '@/app/(with-sidebar)/recipients/components/send/send-to-context';
import { Success } from '@/app/(with-sidebar)/recipients/components/send/success';
import { isBankRecipient, usesTransfersApi, formatPurposeCode } from '@/app/(with-sidebar)/recipients/components/utils';
import { usePurposeCodes } from '@/app/(with-sidebar)/recipients/hooks/use-purpose-codes';
import { stellarScanUrl, baseScanUrl } from '@/app/(with-sidebar)/wallet/components/utils';
import { Nt } from '@/components/common/nt';
import { Spinner } from '@/components/common/spinner';
import { TransactionStatusBadge } from '@/components/common/transaction-status-badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';

/** ID of the send to form. You can use with the the `form` attribute of a button to submit the form. */
const sendToFormId = 'send-to-form';

/**
 * A form to send funds to a recipient, be they bank or crypto.
 *
 * Note: This experience is built with the assumption that privy UI confirmation is disabled
 *
 * TODO: Consider reading endorsement status to disable interacting with USD or EUR accounts if endorsements are disabled -- is that even possible?
 * TODO: Explore decimal precision. For banks, we probably want to truncate. For crypto, we need more decimals allowed. Check bridge docs.
 *
 * Note: Because of some quirks with Radix dialogs and the fact that the send dialog can be opened overtop of other drawers or sheets,
 * we must take the advice mentioned in [this issue](https://github.com/radix-ui/primitives/issues/1088#issuecomment-2720144489) and lock
 * package versions to the following:
 *
 * ```json
 * "@radix-ui/react-dropdown-menu": "2.1.4",
 * "@radix-ui/react-select": "2.1.4",
 * "@radix-ui/react-popover": "1.1.4",
 * "@radix-ui/react-dialog": "1.1.4",
 *
 * "overrides": {
 *   "@radix-ui/react-dismissable-layer": "1.1.4"
 * }
 * ```
 */
export const SendToForm = ({ onAdd }: { onAdd?: () => void }) => {
  const {
    isPreview,
    recipients,
    maxAmount,
    transferResult,
    sendFunds,
    selectedRecipient,
    paymentChain,
    sendDisabledReason,
    feeBreakdown,
    recipientMinAmount,
    recipientMaxAmount,
    isFeeEstimatePending,
    isFeeEstimateUnavailable,
  } = useSendToContext();

  const form = useSendToFormContext();
  const { amount } = useWatch({
    control: form.control,
  });

  const { isSubmitting, errors } = useSendToFormState();

  const showPurposeCode = !!selectedRecipient && usesTransfersApi(selectedRecipient);
  const { data: purposeCodesData } = usePurposeCodes(
    showPurposeCode ? selectedRecipient?.type : undefined
  );

  const onSubmit = async (data: SendToFormSchema) => {
    if (!isPreview || !selectedRecipient) return;
    await sendFunds(data.amount, data.purposeCode);
  };

  if (isSubmitting) {
    return <Processing />;
  }

  if (transferResult?.status === 'success') {
    if (!amount || !selectedRecipient) return null;
    return <Success amount={amount} recipient={selectedRecipient} />;
  }

  if (transferResult?.status === 'fail') {
    return (
      <div className='animate-in fade-in-0 flex flex-col items-center justify-center gap-6'>
        <TransactionStatusBadge status='Rejected' />
        <span className='text-sm font-medium leading-none'>
          There was a problem with the transfer. Please try again.
        </span>
      </div>
    );
  }

  const showPreview = amount && selectedRecipient && isPreview;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-10'
      id={sendToFormId}
    >
      {showPreview ? (
        <PreviewSend amount={amount} recipient={selectedRecipient} />
      ) : (
        <>
          {/* Recipient select */}
          <FormField
            control={form.control}
            name='recipient'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === 'add-new') {
                        field.onChange('', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.trigger();
                        onAdd?.();
                      } else {
                        field.onChange(value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.trigger();
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a recipient' />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients?.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          {recipient.label}
                        </SelectItem>
                      ))}
                      <SelectItem value='add-new' className='pl-1'>
                        <div className='flex items-center gap-2 font-semibold'>
                          <Plus className='size-5' />
                          Add new recipient
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='space-y-3'>
            {/* Amount input */}
            <FormField
              control={form.control}
              name='amount'
            render={({ field }) => {
                const [displayValue, setDisplayValue] = useState(
                  field.value ? String(field.value) : ''
                );

                // Sync displayValue when field.value changes externally (e.g. percentage buttons)
                useEffect(() => {
                  const fieldStr = field.value ? String(field.value) : '';
                  // Only sync if the numeric value actually changed (avoid overwriting during typing)
                  if (parseFloat(displayValue) !== field.value && !isNaN(field.value)) {
                    setDisplayValue(fieldStr);
                  }
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [field.value]);

                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        value={displayValue}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setDisplayValue(raw);
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            form.setValue('amount', num, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else if (raw === '' || raw === '.') {
                            form.setValue('amount', 0, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                        type='text'
                        inputMode='decimal'
                        min={recipientMinAmount}
                        max={recipientMaxAmount ?? undefined}
                        step='any'
                        className='no-spin-buttons text-md'
                      />
                    </FormControl>
                    {maxAmount !== undefined && !errors.amount && (
                      <p className='text-sm text-[#71717A]'>
                        {formatCurrency(maxAmount ?? 0)} USDC Available
                      </p>
                    )}
                    {isBankRecipient(selectedRecipient) && recipientMinAmount !== undefined && (
                      <p className='text-muted-foreground text-xs'>
                        Limits: minimum {formatCurrency(recipientMinAmount)} USDC
                        {recipientMaxAmount !== null && recipientMaxAmount !== undefined
                          ? ` · maximum ${formatCurrency(recipientMaxAmount)} USDC`
                          : ' · no upper limit'}
                      </p>
                    )}
                    {selectedRecipient && (
                      <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                        <Image
                          src={
                            paymentChain === 'stellar'
                              ? '/svg/stellar_logo.svg'
                              : '/svg/base_logo.svg'
                          }
                          alt={paymentChain === 'stellar' ? 'Stellar' : 'Base'}
                          width={14}
                          height={14}
                        />
                        <span>
                          Paying from your{' '}
                          {paymentChain === 'stellar' ? 'Stellar' : 'Base'}{' '}
                          wallet
                        </span>
                      </div>
                    )}
                    {isBankRecipient(selectedRecipient) &&
                      field.value > 0 &&
                      isFeeEstimatePending && (
                        <p className='text-muted-foreground text-xs'>
                          Fetching exchange rate...
                        </p>
                      )}
                    {isBankRecipient(selectedRecipient) &&
                      field.value > 0 &&
                      isFeeEstimateUnavailable && (
                        <p className='text-muted-foreground text-xs'>
                          Exchange rate temporarily unavailable.
                        </p>
                      )}
                    {isBankRecipient(selectedRecipient) &&
                      feeBreakdown &&
                      feeBreakdown.totalFee < feeBreakdown.sendAmount &&
                      field.value > 0 && (
                        <p className='text-muted-foreground text-xs'>
                          {feeBreakdown.fxRate
                            ? `${feeBreakdown.sendAmount.toFixed(2)} USDC − ${feeBreakdown.totalFee.toFixed(2)} fee = ${feeBreakdown.amountAfterFee.toFixed(2)} USDC × ${feeBreakdown.fxRate.toFixed(4)} ≈ ${feeBreakdown.receiveAmount.toFixed(2)} ${feeBreakdown.destinationCurrency}`
                            : `${feeBreakdown.sendAmount.toFixed(2)} USDC − ${feeBreakdown.totalFee.toFixed(2)} fee ≈ ${feeBreakdown.receiveAmount.toFixed(2)} ${feeBreakdown.destinationCurrency} received`
                          }
                        </p>
                      )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Percentage buttons */}
            {maxAmount !== undefined && (
              <Percentages
                disabled={maxAmount === undefined || !!sendDisabledReason}
                onClick={(percentage) =>
                  form.setValue('amount', maxAmount * (percentage / 100), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            )}
          </div>

          {/* Purpose code — required for ACH/WIRE recipients */}
          {showPurposeCode && (
            <FormField
              control={form.control}
              name='purposeCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Transfer</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value) =>
                        form.setValue('purposeCode', value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a purpose' />
                      </SelectTrigger>
                      <SelectContent>
                        {(purposeCodesData?.purposeCodes ?? []).map((code) => (
                          <SelectItem key={code} value={code}>
                            {formatPurposeCode(code)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}
    </form>
  );
};

export const SendToFormSubmitButton = () => {
  const { isPreview, setIsPreview, transferResult, sendDisabledReason } =
    useSendToContext();
  const { isSubmitting, isValid } = useSendToFormState();
  const disabled = !isValid || !!sendDisabledReason;

  if (isSubmitting || transferResult) {
    return null;
  }

  if (!isPreview) {
    return (
      <Button
        className='w-full transition-opacity duration-200 sm:flex-1'
        variant='sorbet'
        type='button'
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          setIsPreview(true);
        }}
      >
        Preview
      </Button>
    );
  }

  return (
    <Button
      className='w-full transition-opacity duration-200 sm:flex-1'
      variant='sorbet'
      form={sendToFormId}
      type='submit'
    >
      {isSubmitting && <Spinner />}
      {isSubmitting ? 'Sending...' : 'Send'}
    </Button>
  );
};

/**
 * Back button for the send form.
 * If pressed in preview mode, exits preview.
 * If called on first step, calls callback
 */
export const SendToFormBackButton = ({ onClose }: { onClose?: () => void }) => {
  const { isPreview, setIsPreview, transferResult, clearTransferResult } =
    useSendToContext();
  const { isSubmitting } = useSendToFormState();

  const handleClick = () => {
    isPreview && setIsPreview(false);
    !isPreview && onClose?.();
  };

  if (isSubmitting) {
    return null;
  }

  if (transferResult?.status === 'success') {
    return (
      <Button
        className='w-full transition-opacity duration-200 sm:w-auto sm:shrink-0'
        variant='secondary'
        type='button'
        asChild
      >
        <Nt
          href={
            transferResult.chain === 'stellar'
              ? stellarScanUrl(transferResult.hash)
              : baseScanUrl(transferResult.hash)
          }
        >
          View details
        </Nt>
      </Button>
    );
  }

  if (transferResult?.status === 'fail') {
    return (
      <Button
        className='w-full transition-opacity duration-200 sm:w-auto sm:shrink-0'
        variant='secondary'
        type='button'
        onClick={() => {
          setIsPreview(true);
          clearTransferResult();
        }}
      >
        Try again
      </Button>
    );
  }

  return (
    <Button
      className='w-full transition-opacity duration-200 sm:w-auto sm:shrink-0'
      variant='secondary'
      type='button'
      onClick={handleClick}
    >
      Cancel
    </Button>
  );
};
