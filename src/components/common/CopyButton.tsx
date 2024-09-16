import { CheckCircle, Copy06 } from '@untitled-ui/icons-react';
import React, { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  onCopy: () => void;
}

// TODO: Share this component with share dialog
/**
 * Copy button that shows a checkmark for 1.5 seconds after copying
 * You decide how to handle the copy action via `onCopy`.
 */
export const CopyButton: React.FC<CopyButtonProps> = ({ onCopy }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    setIsCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      console.log('timeout cleared');
      timeoutRef.current = null;
    }, 1500);

    onCopy();
  };

  return (
    <Button
      variant='link'
      className='h-fit p-0'
      // className='group m-0 border-none bg-transparent p-0 hover:bg-transparent'
      onClick={handleClick}
      disabled={isCopied}
    >
      {isCopied ? (
        <CheckCircle className='animate-in zoom-in-0 size-3 text-green-500' />
      ) : (
        <Copy06 className='animate-in zoom-in-0 size-3' />
      )}
    </Button>
  );
};
