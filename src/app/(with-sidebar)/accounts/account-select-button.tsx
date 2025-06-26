import { Check, Lock } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Button representing a virtual account and if it is locked or not
 * May be "selected" when showing account details
 */
export const AccountSelectButton = ({
  id,
  selected,
  onSelect,
}: {
  id: 'usd' | 'eur';
  selected: boolean;
  onSelect: () => void;
}) => {
  // Use country data page as this expands
  const countryCode = id === 'usd' ? 'us' : 'eu';
  const isLocked = true;

  return (
    <Button
      variant='outline'
      className={cn('h-fit p-6', selected && 'border-foreground bg-muted/25')}
      onClick={onSelect}
    >
      <div className='flex w-full items-center gap-1.5'>
        <CircleFlag countryCode={countryCode} className='size-10' />
        <div className='flex-1 text-left font-semibold'>
          <span className='uppercase'>{id}</span>
          <span> account</span>
        </div>
        {isLocked ? <Lock /> : <Check />}
      </div>
    </Button>
  );
};
