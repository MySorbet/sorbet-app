import Image from 'next/image';

import { InvoiceStatus } from '@/app/invoices/components/dashboard/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { InvoiceStatusBadge } from './dashboard/invoice-status-badge';

export type InvoiceReceiptProps = {
  status: Extract<InvoiceStatus, 'Paid' | 'Cancelled'>;
};

export const InvoiceReceipt = ({ status }: InvoiceReceiptProps) => {
  return (
    <div className='flex w-full max-w-[800px] flex-col items-center justify-center gap-16 rounded-2xl bg-white p-16'>
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <Image
          src='/svg/logo.svg'
          alt='Sorbet logo'
          width={36}
          height={36}
          className='h-9 w-9'
          priority
        />
        <span className='text-sorbet-foreground font-semibold'>SORBET</span>
      </div>

      {/* Status */}
      <div className='space-y-3 text-center'>
        <InvoiceStatusBadge variant={status}>{status}</InvoiceStatusBadge>
        <h1 className='text-3xl font-semibold'>
          {status === 'Paid'
            ? 'This invoice has been paid'
            : 'This invoice is no longer active'}
        </h1>
      </div>

      <Separator />

      {/* Sorbet info */}
      <div className='flex flex-col items-center gap-1 text-center'>
        <span className='text-sm font-semibold'>
          Sorbet is a link-in-bio powering global payments
        </span>
        <span className='text-muted-foreground text-sm'>
          Collaborate with clients globally and get paid in USDC
        </span>
        <Button asChild variant='outline' className='mt-7 w-fit'>
          <a
            href='https://mysorbet.xyz'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn more
          </a>
        </Button>
      </div>
    </div>
  );
};
