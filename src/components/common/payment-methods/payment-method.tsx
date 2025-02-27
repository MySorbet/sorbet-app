import { CornerDownRight } from 'lucide-react';

import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Common component to render a payment method to the client.
 */
export const PaymentMethod = ({
  title,
  tooltip,
  timing,
  children,
  Icon,
}: {
  title: React.ReactNode;
  tooltip?: string;
  timing?: string;
  children?: React.ReactNode;
  Icon: React.ElementType;
}) => {
  return (
    <div className={cn('group flex w-full gap-4')}>
      <CornerDownRight className='text-muted-foreground ml-2 size-6 shrink-0' />
      <div className='flex w-full flex-col gap-2 pb-3 pr-3 pt-1'>
        <div className='flex w-full items-center gap-1'>
          <Icon className='size-6 shrink-0' />
          <Label className='text-sm font-medium'>{title}</Label>
          {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
          {timing && (
            <span className='ml-auto text-right text-xs text-[#5B6BFF]'>
              {timing}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
