import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SummaryCardProps {
  label: string;
  value: number;
  invoiceCount: number;
  isLoading?: boolean;
}

// TODO: Look into muted-foreground vs secondary-foreground text color matching design
/**
 * Summary cards to display on the invoicing dashboard
 */
export default function SummaryCard({
  label,
  value,
  invoiceCount,
  isLoading,
}: SummaryCardProps) {
  if (isLoading) {
    return <SummaryCardSkeleton />;
  }

  return (
    <Card className='w-full max-w-sm rounded-2xl border-none bg-white shadow-none'>
      <CardContent className='flex flex-col items-start gap-1 px-6 py-4'>
        <h2 className='text-muted-foreground text-xs font-medium'>{label}</h2>
        <p className='text-xl font-semibold'>
          $
          {value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className='text-muted-foreground text-xs font-medium'>
          {invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
}

export const SummaryCardSkeleton = () => {
  return (
    <Card className='w-full max-w-sm rounded-2xl border-none bg-white shadow-none'>
      <CardContent className='flex flex-col items-start gap-1 px-6 py-4'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-7 w-32' />
        <Skeleton className='h-4 w-24' />
      </CardContent>
    </Card>
  );
};
