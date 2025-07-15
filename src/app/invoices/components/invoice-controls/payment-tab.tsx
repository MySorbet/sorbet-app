'use client';

import { kebabCase } from 'lodash';
import { LockKeyhole } from 'lucide-react';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { PaymentMethodDescription } from '@/components/common/payment-methods/payment-method-description';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatWalletAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';

import { useInvoiceForm } from '../../hooks/use-invoice-form';
import { type AcceptedPaymentMethod } from '../../schema';

/**
 * The 2nd tab of the invoice controls, "Payment"
 * - Renders the payment tab allowing the user to choose which payment methods to accept
 * - Manipulates form data via `useInvoiceForm`
 */
export const PaymentTab = ({
  onGetVerified,
  walletAddress,
  isEurEndorsed,
}: {
  /** Callback indicating the user wants to get verified. Only included if the user is not verified. */
  onGetVerified?: () => void;
  /** The wallet address to display for the USDC payment method. Passing `undefined` will show a skeleton. */
  walletAddress?: string;
  /** Whether the user is endorsed for EUR payments. Only included if the user is not endorsed. */
  isEurEndorsed?: boolean;
}) => {
  // If a callback is not provided, the user is verified
  const isVerified = !onGetVerified;
  const formattedAddress = walletAddress && formatWalletAddress(walletAddress);

  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6 '>
        <CardTitle className='text-base font-semibold'>
          Accepted payment methods
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        <PaymentMethod
          title='Accept USDC payments'
          timing='Arrives instantly'
          tooltip='Your crypto wallet to receive instant USDC payments on the Base network'
          disabled={false}
          method='usdc'
        >
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>My Wallet</span>
            <div className='flex items-center gap-1 text-sm'>
              {formattedAddress ?? <Skeleton className='h-5 w-24' />}
              <CopyIconButton
                stringToCopy={walletAddress}
                className='ml-1'
                disabled={!walletAddress}
                aria-label='Copy wallet address'
              />
            </div>
          </div>
          <PaymentMethodDescription>
            You'll receive payments directly to your USDC wallet on the Base
            network
          </PaymentMethodDescription>
        </PaymentMethod>

        <PaymentMethod
          title='Accept USD payments'
          tooltip='Your free USD account to receive ACH/Wire payments'
          timing={isVerified ? 'Arrives in 1-2 days' : undefined}
          locked={!isVerified}
          disabled={false}
          method='usd'
        >
          <PaymentMethodDescription>
            Your client can pay via ACH/Wire transfer to your USD virtual
            account
          </PaymentMethodDescription>
          {!isVerified && (
            <Button
              variant='outline'
              className='w-full'
              onClick={onGetVerified}
            >
              Get verified in minutes
            </Button>
          )}
        </PaymentMethod>
        <PaymentMethod
          title='Accept EUR payments'
          tooltip='Your free EUR account to receive SEPA payments'
          timing={isEurEndorsed ? 'Arrives in 1-2 days' : undefined}
          locked={!isEurEndorsed}
          disabled={false}
          method='eur'
        >
          <PaymentMethodDescription>
            Your client can pay via SEPA transfer to your EUR virtual account
          </PaymentMethodDescription>
          {!isEurEndorsed && (
            <Button
              variant='outline'
              className='w-full'
              onClick={onGetVerified}
            >
              {isVerified
                ? 'Finish your SEPA verification'
                : 'Get verified in minutes'}
            </Button>
          )}
        </PaymentMethod>
      </CardContent>
    </Card>
  );
};

type PaymentMethodProps = {
  title: string;
  tooltip?: string;
  timing?: string;
  disabled?: boolean;
  locked?: boolean;
  loading?: boolean;
  method: AcceptedPaymentMethod;
  children?: React.ReactNode;
};

/**
 * Local component for rendering a payment method. Essentially a checkbox with some bells and whistles.
 * - Manipulates form data via `useInvoiceForm`
 * - Very similar to the common `PaymentMethod`, but specialized for the invoice controls
 */
const PaymentMethod = ({
  title,
  tooltip,
  timing,
  disabled,
  locked,
  method,
  children,
}: PaymentMethodProps) => {
  const form = useInvoiceForm();

  return (
    <div className={cn('group flex w-full gap-4')}>
      {locked ? (
        <LockKeyhole className='text-muted-foreground mt-2 size-4 shrink-0' />
      ) : (
        <FormField
          control={form.control}
          name='paymentMethods'
          render={({ field }) => {
            const isLastSelected =
              field.value.length === 1 && field.value.includes(method);

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Need to wrap the checkbox in a div to prevent the tooltip from effecting the checkbox style */}
                  <div>
                    <Checkbox
                      checked={field.value.includes(method)}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked
                            ? [...field.value, method]
                            : field.value.filter((m) => m !== method)
                        );
                      }}
                      disabled={disabled || isLastSelected}
                      id={kebabCase(title)}
                      className='mt-2'
                      aria-label={`Select ${title}${
                        isLastSelected ? ' (required)' : ''
                      }`}
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
        <div className='flex w-full items-center gap-1'>
          <Label className='text-sm font-medium' htmlFor={kebabCase(title)}>
            {title}
          </Label>
          {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}

          {timing && (
            <span className='text-sorbet-blue ml-auto text-right text-xs'>
              {timing}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
