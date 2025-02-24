import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '~/svg/logo.svg';

/**
 * Header for the create invoice page
 * Will render a close button if onClose is provided
 * Renders children justified between. Use auto-margins to align as needed
 */
export const InvoiceHeader = ({
  onClose,
  children,
  className,
}: {
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2 px-4 py-2',
        className
      )}
    >
      <Logo className='size-8' alt='Sorbet logo' />
      {children}
      {onClose && (
        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground p-1.5'
          onClick={onClose}
        >
          <X strokeWidth={2} />
        </Button>
      )}
    </div>
  );
};
