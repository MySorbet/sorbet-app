import { ArrowLeft } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type BackButtonProps = ButtonProps;
/**
 * A button that renders as with outline and an animated left arrow icon.
 */
export const BackButton = ({
  children,
  className,
  ...props
}: BackButtonProps) => {
  return (
    <Button
      variant='outline'
      type='button' // To prevent this button from submitting if it is wrapped in a form
      className={cn('group', className)}
      {...props}
    >
      <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
      {children}
    </Button>
  );
};
