import { CornerDownRight } from '@untitled-ui/icons-react';
import { BadgeDollarSign, Info } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { FC } from 'react';

import { ACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { formatWalletAddress } from '@/app/wallet/components/utils'; // TODO: Import from lib
import { BaseAlert } from '@/components/common/base-alert';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import USDCBaseIcon from '~/svg/base-usdc.svg';

import { formatDate } from '../../components/dashboard/utils';
import { useBaseQRCode } from '../hooks/use-base-qr-code';
import { AcceptedPaymentMethod } from '../schema';

/**
 *  Renders payment details for the client to pay the invoice
 *  Pass a wallet address to render the USDC payment method
 *  Pass a bank account to render the USD payment method
 */
export const ClientPaymentCard = ({
  address,
  account,
  dueDate,
}: {
  address?: string;
  account?: ACHWireDetails;
  dueDate: Date;
}) => {
  const type: AcceptedPaymentMethod = 'usd';
  const title = `Payment due by ${formatDate(dueDate)}`;
  const description =
    type === 'usdc' ? 'Send USDC on Base network' : 'Transfer via ACH/Wire';

  // TODO: Conditional tabs (if design approves?)

  return (
    <Card>
      <CardHeader className='bg-primary-foreground space-y-0 rounded-t-md px-4 py-6'>
        <CardTitle className='text-base font-semibold'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='p-3'>
        {address && <PaymentMethodUSDC address={address} />}
        {account && <PaymentMethodUSD account={account} />}
      </CardContent>
    </Card>
  );
};

/** Local component to render a payment method to the client. Very similar to payment methods rendered in the invoice form for the freelancer */
const PaymentMethod = ({
  title,
  tooltip,
  timing,
  children,
  Icon,
}: {
  title: string;
  tooltip?: string;
  timing?: string;
  loading?: boolean;
  children?: React.ReactNode;
  Icon: React.ElementType;
}) => {
  return (
    <div className={cn('group flex w-full gap-4')}>
      <CornerDownRight className='text-muted-foreground ml-2 size-6 shrink-0' />
      <div className='flex w-full flex-col gap-2 pb-3 pr-3 pt-1'>
        <div className='flex w-full items-center gap-1'>
          <Icon className='size-6 shrink-0' />
          <Label className='text-sm font-medium' htmlFor={title}>
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

/** Local component specializing the PaymentMethod component for USDC */
const PaymentMethodUSDC = ({ address }: { address: string }) => {
  const formattedAddress = formatWalletAddress(address);
  const { qrCodeRef, isLoadingQRCode } = useBaseQRCode(address);
  return (
    <PaymentMethod
      title='USDC wallet'
      Icon={USDCBaseIcon}
      timing='Arrives instantly'
    >
      <div className='flex items-center justify-between'>
        <span className='text-muted-foreground text-sm'>Wallet</span>
        <div className='flex items-center gap-1 text-sm'>
          {formattedAddress}
          <CopyIconButton stringToCopy={address} className='ml-1' />
        </div>
      </div>
      <Card className='flex items-center justify-center p-3'>
        {isLoadingQRCode ? (
          <Skeleton className='size-48' />
        ) : (
          <div ref={qrCodeRef} />
        )}
      </Card>
      <BaseAlert
        description='This address can only receive USDC on the Base Network. Funds may be lost if USDC is sent on another network.'
        className='text-muted-foreground'
      />
    </PaymentMethod>
  );
};

/** Local component specializing the PaymentMethod component for USD */
const PaymentMethodUSD = ({ account }: { account: ACHWireDetails }) => {
  return (
    <PaymentMethod
      title='USD Bank'
      Icon={BadgeDollarSign}
      timing='Arrives in 2-3 days'
      tooltip='Send USD to this bank account to pay this invoice'
    >
      <div className='flex w-full flex-col gap-2'>
        <VirtualAccountRow>
          <VirtualAccountRowLabel>Account number</VirtualAccountRowLabel>
          <VirtualAccountRowValue>
            {account.accountNumber}
            <CopyIconButton stringToCopy={account.accountNumber} />
          </VirtualAccountRowValue>
        </VirtualAccountRow>
        <VirtualAccountRow>
          <VirtualAccountRowLabel>Routing number</VirtualAccountRowLabel>
          <VirtualAccountRowValue>
            {account.routingNumber}
            <CopyIconButton stringToCopy={account.routingNumber} />
          </VirtualAccountRowValue>
        </VirtualAccountRow>
        <VirtualAccountRow>
          <VirtualAccountRowLabel>Account type</VirtualAccountRowLabel>
          <VirtualAccountRowValue>
            {account.beneficiary.accountType}
          </VirtualAccountRowValue>
        </VirtualAccountRow>
        <VirtualAccountRow>
          <VirtualAccountRowLabel>Recipient</VirtualAccountRowLabel>
          <VirtualAccountRowValue>
            {account.beneficiary.name}
            <CopyIconButton stringToCopy={account.beneficiary.name} />
          </VirtualAccountRowValue>
        </VirtualAccountRow>
        <Accordion type='single' collapsible>
          <AccordionItem value='additional-details' className='border-none p-0'>
            <AccordionTrigger className='text-muted-foreground border-none p-0 pb-2 text-sm font-normal'>
              Additional details
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-2 p-0'>
              <VirtualAccountRow>
                <VirtualAccountRowLabel>Bank name</VirtualAccountRowLabel>
                <VirtualAccountRowValue>
                  {account.bank.name}
                </VirtualAccountRowValue>
              </VirtualAccountRow>
              <VirtualAccountRow>
                <VirtualAccountRowLabel>Bank address</VirtualAccountRowLabel>
                <VirtualAccountRowValue>
                  {account.bank.address}
                </VirtualAccountRowValue>
              </VirtualAccountRow>
              {/* //TODO: Any more additional details? */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PaymentMethod>
  );
};

// 👇 Local components to keep virtual account render DRY

const VirtualAccountRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className='flex items-center justify-between'>{children}</div>;
};

const VirtualAccountRowLabel: FC<PropsWithChildren> = ({ children }) => {
  return <span className='text-muted-foreground text-sm'>{children}</span>;
};

const VirtualAccountRowValue: FC<PropsWithChildren> = ({ children }) => {
  return <span className='flex items-center gap-1 text-sm'>{children}</span>;
};
