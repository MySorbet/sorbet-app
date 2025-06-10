import { Clock } from 'lucide-react';

export const Timing = ({ type }: { type: 'usd' | 'eur' | 'crypto' }) => {
  const time = type === 'usd' || type === 'eur' ? '1-3 days' : '2 mins';
  return (
    <p className='text-muted-foreground flex items-center gap-1 text-xs leading-none'>
      <Clock className='size-3' /> Arrives in approx. {time}
    </p>
  );
};
