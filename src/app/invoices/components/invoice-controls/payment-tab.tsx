'use client';

import { kebabCase } from 'lodash';
import { Info, LockKeyhole } from 'lucide-react';
import { forwardRef } from 'react';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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
}: {
  /** Callback indicating the user wants to get verified. Only included if the user is not verified. */
  onGetVerified?: () => void;
  /** The wallet address to display for the USDC payment method. Passing `undefined` will show a skeleton. */
  walletAddress?: string;
}) => {
  // TODO: Implement "at least one payment method" validation
  const form = useInvoiceForm();
  const { paymentMethods } = form.watch();
  const handlePaymentMethodChange = (method: AcceptedPaymentMethod) => {
    const newPaymentMethods = paymentMethods.includes(method)
      ? paymentMethods.filter((m) => m !== method)
      : [...paymentMethods, method];
    form.setValue('paymentMethods', newPaymentMethods);
  };

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
          checked={paymentMethods.includes('usdc')}
          onCheckedChange={() => handlePaymentMethodChange('usdc')}
        >
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>My Wallet</span>
            <div className='flex items-center gap-1 text-sm'>
              {formattedAddress ?? <Skeleton className='h-5 w-24' />}
              <CopyIconButton
                stringToCopy={walletAddress}
                className='ml-1'
                disabled={!walletAddress}
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
          checked={paymentMethods.includes('usd')}
          onCheckedChange={() => handlePaymentMethodChange('usd')}
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
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
};

const PaymentMethod = ({
  title,
  tooltip,
  timing,
  disabled,
  locked,
  checked,
  onCheckedChange,
  children,
}: PaymentMethodProps) => {
  return (
    <div className={cn('group flex w-full gap-4')}>
      {locked ? (
        <LockKeyhole className='text-muted-foreground mt-2 size-4 shrink-0' />
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          id={kebabCase(title)}
          className='mt-2'
        />
      )}
      <div className='flex flex-col gap-2 pb-3 pr-3 pt-1'>
        <div className='flex w-full items-center gap-1'>
          <Label className='text-sm font-medium' htmlFor={kebabCase(title)}>
            {title}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='text-muted-foreground size-4 shrink-0 cursor-pointer' />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {timing && (
            <span className='ml-auto text-right text-xs text-[#5B6BFF]'>
              {timing}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

const PaymentMethodDescription = forwardRef<
  HTMLSpanElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('text-muted-foreground text-sm font-normal', className)}
      {...props}
    >
      {children}
    </span>
  );
});
