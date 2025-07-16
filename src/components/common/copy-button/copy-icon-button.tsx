import { CircleCheck, Copy } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

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

export interface CopyIconButtonHandle {
  copy: () => void /** Programmatically trigger the copy action */;
}

/**
 * Copy icon button that shows a checkmark for 1.5 seconds after copying.
 *
 * You can use a ref to programmatically trigger the copy action if this is part of a larger component.
 * Responds to group hover.
 */
export const CopyIconButton = forwardRef<
  CopyIconButtonHandle,
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
    const [hasRendered, setHasRendered] = useState(false);

    // Similar to using `cn` for classnames, we need to manually combine out onclick with one that is passed
    // Otherwise, the onclick passed from the parent will override the copy action
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopied || disabled) return; // Early return if already copied or disabled
      if (!hasRendered) setHasRendered(true);
      handleCopy();
      onClick?.(e);
    };

    useImperativeHandle(ref, () => ({
      copy: handleCopy,
    }));

    return (
      <Button
        variant='link'
        className={cn(
          'h-fit p-0 transition-transform hover:scale-110 group-hover:scale-110',
          className
        )}
        onClick={handleClick}
        disabled={isCopied || disabled}
        {...props}
      >
        {isCopied ? (
          <CircleCheck
            className={cn(
              'animate-in zoom-in-50 fade-in-0 p-0 text-green-500',
              checkIconClassName
            )}
          />
        ) : (
          <Copy
            className={cn(
              'text-muted-foreground p-0',
              hasRendered && 'animate-in zoom-in-50 fade-in-0',
              copyIconClassName
            )}
          />
        )}
      </Button>
    );
  }
);

CopyIconButton.displayName = 'CopyIconButton';
