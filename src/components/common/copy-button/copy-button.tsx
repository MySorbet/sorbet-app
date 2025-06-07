'use client';

import { CircleCheck, Copy } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

import useCopy from '@/components/common/copy-button/use-copy';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends ButtonProps {
  stringToCopy: string /** string to copy to the clipboard */;
  className?: string /** Applied to the root button */;
  copyIconClassName?: string /** Applied to the copy icon */;
  checkIconClassName?: string /** Applied to the check icon */;
}

// TODO: Shall we figure out a way to combine this with <CopyIconButton />?
// The difference is that  <CopyIconButton /> is just the tiny icon where as this is an outline button
// Perhaps a `<CopyButton variant='outline' variant='tiny' />`?

/**
 * Copy button that shows a checkmark for 1.5 seconds after copying.
 * You decide how to handle the copy action via `onCopy`.
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      stringToCopy,
      copyIconClassName,
      checkIconClassName,
      children,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const { isCopied, handleClick: handleCopy } = useCopy(stringToCopy);
    const [hasRendered, setHasRendered] = useState(false);

    // Similar to using `cn` for classnames, we need to manually combine out onclick with one that is passed
    // Otherwise, the onclick passed from the parent will override the copy action
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopied || disabled) return; // Early return if already copied or disabled
      if (!hasRendered) setHasRendered(true);
      handleCopy();
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        variant='outline'
        onClick={handleClick}
        type='button'
        disabled={disabled}
        className={cn('group', className)}
        {...props}
      >
        {isCopied ? (
          <CircleCheck
            className={cn(
              'animate-in zoom-in-50 fade-in-0 p-0 text-green-600',
              checkIconClassName
            )}
          />
        ) : (
          <Copy
            className={cn(
              'text-primary p-0 transition-transform group-hover:scale-110',
              hasRendered && 'animate-in zoom-in-50 fade-in-0',
              copyIconClassName
            )}
          />
        )}
        {children}
      </Button>
    );
  }
);

CopyButton.displayName = 'CopyButton';
