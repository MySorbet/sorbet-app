import { CloudAlert } from 'lucide-react';
import React from 'react';

import { TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Fallback for when an image is broken.
 * Displays a CloudAlert icon and a tooltip with a message.
 */
export const ImageErrorFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  return (
    <div
      className={cn('bg-muted flex items-center justify-center', className)}
      ref={ref}
      {...rest}
    >
      <Tooltip>
        <TooltipTrigger>
          <CloudAlert className='text-muted-foreground size-8' />
        </TooltipTrigger>
        <TooltipContent>
          <p>Something isn't right with this image. Delete it and try again.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
});
