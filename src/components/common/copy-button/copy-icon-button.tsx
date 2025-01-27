import { CheckCircle, Copy06 } from '@untitled-ui/icons-react';
import React, { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useCopy from './use-copy';

interface CopyIconButtonProps {
  stringToCopy?: string /** If provided, this will be copied to the clipboard. */;
  onCopy?: () => void /** Provide your own copy function to be called instead of copying the stringToCopy. */;
  className?: string /** Applied to the root button */;
  copyIconClassName?: string /** Applied to the copy icon */;
  checkIconClassName?: string /** Applied to the check icon */;
}

/**
 * Copy icon button that shows a checkmark for 1.5 seconds after copying.
 */
export const CopyIconButton: React.FC<CopyIconButtonProps> = ({
  stringToCopy,
  onCopy,
  copyIconClassName,
  checkIconClassName,
}) => {
  const { isCopied, handleClick } = useCopy(stringToCopy ?? onCopy);

  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

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
            'text-muted-foreground size-3 p-0',
            !isFirstRender.current && 'animate-in zoom-in-0',
            copyIconClassName
          )}
        />
      )}
    </Button>
  );
};
