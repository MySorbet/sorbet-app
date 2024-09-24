import { CheckCircle, Copy06 } from '@untitled-ui/icons-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useCopy from './use-copy';

interface CopyButtonProps {
  onCopy: () => void;
  className?: string /** Applied to the root button */;
  copyIconClassName?: string /** Applied to the copy icon */;
  checkIconClassName?: string /** Applied to the check icon */;
}

/**
 * Copy button that shows a checkmark for 1.5 seconds after copying.
 * You decide how to handle the copy action via `onCopy`.
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  copyIconClassName,
  checkIconClassName,
}) => {
  const { isCopied, handleClick } = useCopy(onCopy);

  return (
    <Button
      variant='link'
      className='h-fit p-0 hover:scale-105'
      onClick={handleClick}
      disabled={isCopied}
    >
      {isCopied ? (
        <CheckCircle
          className={cn(
            'animate-in zoom-in-0 size-3 p-0 text-green-500',
            checkIconClassName
          )}
        />
      ) : (
        <Copy06
          className={cn(
            'animate-in zoom-in-0 text-muted-foreground size-3 p-0',
            copyIconClassName
          )}
        />
      )}
    </Button>
  );
};
