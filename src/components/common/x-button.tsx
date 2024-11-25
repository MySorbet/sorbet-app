import { X } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CloseButtonProps {
  onClick: () => void;
  className: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      className={cn(className, 'p-0 transition ease-out hover:scale-110')}
    >
      <X className='text-muted-foreground size-full cursor-pointer' />
    </Button>
  );
};
