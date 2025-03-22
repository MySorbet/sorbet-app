import { TextMorph } from '@/components/motion-primitives/text-morph';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

interface WalletSummaryCardProps {
  /** What is this card about */
  label: string;
  /** Monetary value of this card */
  value: number;
  /** Subscript to display after the value */
  subscript: string;
  /** Whether the card is loading */
  isLoading?: boolean;
}

/**
 * Summary cards to display on the wallet page
 *
 * TODO: These are very similar to summary cards used in the invoices dashboard. There are some style differences Could they share?
 */
export const WalletSummaryCard = ({
  label,
  value,
  subscript,
  isLoading,
}: WalletSummaryCardProps) => {
  if (isLoading) return <SummaryCardSkeleton />;

  return (
    <Card className='h-fit w-full max-w-[32rem]'>
      <CardContent className='animate-in fade-in-0 flex flex-col items-start gap-1 p-6'>
        <h2 className='text-muted-foreground text-sm'>{label}</h2>
        <p className='text-2xl font-semibold'>
          <TextMorph>{formatCurrency(value)}</TextMorph>
        </p>
        <p className='text-muted-foreground text-sm'>{subscript}</p>
      </CardContent>
    </Card>
  );
};

const SummaryCardSkeleton = () => {
  return (
    <Card className='h-fit w-full max-w-[32rem]'>
      <CardContent className='animate-in fade-in-0 flex flex-col items-start gap-1 p-6'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-5 w-24' />
      </CardContent>
    </Card>
  );
};
