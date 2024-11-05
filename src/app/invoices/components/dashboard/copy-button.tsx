import { CheckCircle, Copy06 } from '@untitled-ui/icons-react';
import React from 'react';

import useCopy from '@/components/common/copy-button/use-copy';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends ButtonProps {
  onCopy: () => void;
  className?: string /** Applied to the root button */;
  copyIconClassName?: string /** Applied to the copy icon */;
  checkIconClassName?: string /** Applied to the check icon */;
}

// TODO: Shall we figure out a way to combine this with the common copy button?
// The difference is that the "common" copy button is just the tiny icon where as this is an outline button
// Perhaps a `<CopyButton variant='outline' variant='tiny' />`?
/**
 * Copy button that shows a checkmark for 1.5 seconds after copying.
 * You decide how to handle the copy action via `onCopy`.
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  copyIconClassName,
  checkIconClassName,
  children,
  ...props
}) => {
  const { isCopied, handleClick } = useCopy(onCopy);

  return (
    <Button
      variant='outline'
      onClick={handleClick}
      disabled={isCopied}
      {...props}
    >
      {isCopied ? (
        <CheckCircle
          className={cn(
            'animate-in zoom-in-0 size-4 p-0 text-green-600',
            checkIconClassName
          )}
        />
      ) : (
        <Copy06
          className={cn(
            'animate-in zoom-in-0 text-primary size-4 p-0',
            copyIconClassName
          )}
        />
      )}
      <div className='ml-2'>{children}</div>
    </Button>
  );
};
