import { CheckCircle, Copy06 } from '@untitled-ui/icons-react';
import React from 'react';

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
export const CopyButton: React.FC<CopyButtonProps> = ({
  stringToCopy,
  copyIconClassName,
  checkIconClassName,
  children,
  className,
  ...props
}) => {
  const { isCopied, handleClick } = useCopy(stringToCopy);

  return (
    <Button
      variant='outline'
      onClick={handleClick}
      disabled={isCopied}
      className={cn(className, 'group')}
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
            'animate-in zoom-in-0 text-primary size-4 p-0 transition-transform group-hover:scale-110',
            copyIconClassName
          )}
        />
      )}
      {children && <div className='ml-2'>{children}</div>}
    </Button>
  );
};
