import { useState } from 'react';

import useCopy from '@/components/common/copy-button/use-copy';
import { TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';

// Tooltip state inspired by https://github.com/shadcn-ui/ui/issues/86#issuecomment-2241817826
// TODO: Revisit "copy" flash when tooltip is closing (likely due to fade out animation)
// TODO: Revisit tooltip flash when hover steals mouseenter
/** Local component to display formatted address and allow copying */
export const CopyText = ({
  text,
  textToCopy,
}: {
  text: string;
  textToCopy?: string;
}) => {
  const { isCopied, handleClick } = useCopy(textToCopy ?? text);
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open || isCopied}>
      <TooltipTrigger asChild>
        <button
          type='button'
          className='cursor-pointer'
          onClick={() => {
            setOpen(!open);
            handleClick();
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onTouchStart={() => setOpen(!open)}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.key === 'Enter') {
              setOpen(!open);
              handleClick();
            }
          }}
        >
          {text}
        </button>
      </TooltipTrigger>
      <TooltipContent>{isCopied ? 'Copied!' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
};
