import { X } from '@untitled-ui/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
type CreateInvoicePageHeaderProps = {
  /** Called when the close button is clicked */
  onClose?: () => void;
};

/**
 * Invoice creation features a header containing a logo and a close button.
 */
export const CreateInvoicePageHeader = ({
  onClose,
}: CreateInvoicePageHeaderProps) => {
  return (
    <div className='flex items-center justify-between gap-3 px-8 py-4'>
      <Link href='/'>
        <Image
          src='/svg/logo.svg'
          height={44}
          width={44}
          className='size-11'
          alt='Sorbet logo'
          priority
        />
      </Link>
      <Button variant='outline' className='h-fit p-2' onClick={onClose}>
        <X className='size-5' />
      </Button>
    </div>
  );
};
