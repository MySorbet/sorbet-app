import { CircleCheck, Copy } from 'lucide-react';
import React, { forwardRef, useEffect, useRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useCopy from './use-copy';

interface CopyIconButtonProps extends ButtonProps {
  stringToCopy?: string /** If provided, this will be copied to the clipboard. */;
  onCopy?: () => void /** Provide your own copy function to be called instead of copying the stringToCopy. */;
  className?: string /** Applied to the root button */;
  copyIconClassName?: string /** Applied to the copy icon */;
  checkIconClassName?: string /** Applied to the check icon */;
  disabled?: boolean /** If true, the button will not be interactive */;
}

/**
 * Copy icon button that shows a checkmark for 1.5 seconds after copying.
 */
export const CopyIconButton = forwardRef<
  HTMLButtonElement,
  CopyIconButtonProps
>(
  (
    {
      stringToCopy,
      onCopy,
      copyIconClassName,
      checkIconClassName,
      disabled,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const { isCopied, handleClick: handleCopy } = useCopy(
      stringToCopy ?? onCopy
    );

    // Similar to using `cn` for classnames, we need to manually combine out onclick with one that is passed
    // Otherwise, the onclick passed from the parent will override the copy action
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      handleCopy();
      onClick?.(e);
    };

    const isFirstRender = useRef(true);
    useEffect(() => {
      isFirstRender.current = false;
    }, []);

    return (
      <Button
        ref={ref}
        variant='link'
        className={cn('h-fit p-0 hover:scale-105', className)}
        onClick={handleClick}
        disabled={isCopied || disabled}
        {...props}
      >
        {isCopied ? (
          <CircleCheck
            className={cn(
              'animate-in zoom-in-0 p-0 text-green-500',
              checkIconClassName
            )}
          />
        ) : (
          <Copy
            className={cn(
              'text-muted-foreground p-0',
              !isFirstRender.current && 'animate-in zoom-in-0',
              copyIconClassName
            )}
          />
        )}
      </Button>
    );
  }
);
