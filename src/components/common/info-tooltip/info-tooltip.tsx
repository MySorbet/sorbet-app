import { Info } from 'lucide-react';
import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/** Standardize the info tooltip component for use in the app */
export const InfoTooltip = React.forwardRef<
  React.ElementRef<typeof Info>,
  React.ComponentPropsWithoutRef<typeof Info>
>(({ children, className, ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info
          ref={ref}
          className={cn(
            'text-muted-foreground size-4 shrink-0 cursor-help',
            className
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
});

InfoTooltip.displayName = 'InfoTooltip';
