import { X } from '@untitled-ui/icons-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

type CreateInvoicePageHeaderProps = {
  onClose?: () => void;
};

export const CreateInvoicePageHeader = ({
  onClose,
}: CreateInvoicePageHeaderProps) => {
  return (
    <div className='flex items-center justify-between gap-3 px-8 py-4'>
      <Image
        src='/svg/logo.svg'
        height={44}
        width={44}
        className='size-11'
        alt='Sorbet logo'
        priority
      />
      <Button variant='outline' className='h-fit p-2' onClick={onClose}>
        <X className='size-5' />
      </Button>
    </div>
  );
};
